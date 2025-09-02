# ros-in-esp8266

ESP8266 ROS-like Framework
Sistema IoT distribuído com arquitetura inspirada no ROS (Robot Operating System) para ESP8266
Este projeto implementa uma arquitetura modular e distribuída para ESP8266, seguindo os padrões do ROS com nós, tópicos, mensagens e launch files, proporcionando desenvolvimento escalável e organizando para projetos IoT complexos.
🏗️ Arquitetura
text
esp8266_ws/
├── src/
│   ├── msg/                    # Definições de mensagens (similar aos .msg do ROS)
│   │   └── sensor_msgs.py
│   ├── communication/          # Sistema de comunicação base
│   │   └── ros_node.py
│   ├── sensors/               # Nós sensores
│   │   └── temperature_node.py
│   ├── actuators/             # Nós atuadores  
│   │   └── led_node.py
│   ├── launch/                # Launch files
│   │   └── robot_launch.py
│   └── param/                 # Configurações
│       └── robot_config.yaml
├── boot.py                    # Inicialização do sistema
├── main.py                    # Ponto de entrada principal
└── Makefile                   # Comandos de deploy e desenvolvimento

Componentes Principais
Nós (Nodes): Processos independentes para sensores/atuadores
Tópicos (Topics): Comunicação pub/sub via MQTT
Mensagens: Estruturas padronizadas de dados
Launch Files: Scripts para inicializar múltiplos componentes
Parâmetros: Configurações centralizadas
🚀 Instalação Rápida
Pré-requisitos (macOS)
bash
# Instalar dependências via Homebrew
brew install python3 screen

# Instalar ferramentas ESP8266
pip3 install adafruit-ampy esptool pyyaml paho-mqtt

# Instalar drivers USB (se necessário)
brew install --cask silicon-labs-vcp-driver

Setup do Projeto
bash
# Clonar e configurar workspace
git clone https://github.com/seu-usuario/esp8266-ros-framework
cd esp8266-ros-framework

# Identificar porta do ESP8266
ls /dev/cu.usbserial-*

# Configurar porta no Makefile
sed -i '' 's|/dev/cu.usbserial-XXXX|/dev/cu.usbserial-14420|g' Makefile

Flash do Firmware MicroPython
bash
# Baixar firmware
curl -O https://micropython.org/resources/firmware/esp8266-20210902-v1.17.bin

# Flash completo
esptool.py --chip esp8266 --port /dev/cu.usbserial-14420 erase_flash
esptool.py --port /dev/cu.usbserial-14420 --chip esp8266 --baud 115200 \
  write_flash --flash_size=detect -fm dout 0 esp8266-20210902-v1.17.bin

📡 Sincronização com Microcontrolador
Deploy Completo (Primeira Vez)
bash
# Deploy de todo o workspace ROS-like
make deploy-workspace

# Verificar arquivos enviados
make list

Saída esperada:
text
/boot.py
/main.py
/src
/src/msg
/src/msg/sensor_msgs.py
/src/communication
/src/communication/ros_node.py
/src/sensors
/src/sensors/temperature_node.py
/src/actuators
/src/actuators/led_node.py
/src/launch
/src/launch/robot_launch.py

Deploy Incremental (Durante Desenvolvimento)
bash
# Apenas launch files (mais rápido para testes)
make deploy-launch

# Apenas nós modificados
make deploy-nodes

# Conectar ao ESP8266 para debug
make connect

Processo de Sincronização Detalhado
1. Upload de Arquivos
bash
# O Makefile usa ampy para sincronizar arquivos
ampy -p /dev/cu.usbserial-14420 -b 115200 put src/sensors src/sensors

2. Verificação de Integridade
bash
# Listar estrutura completa
ampy -p /dev/cu.usbserial-14420 ls -r

# Verificar conteúdo de arquivo específico
ampy -p /dev/cu.usbserial-14420 get src/sensors/temperature_node.py

3. Execução no ESP8266
bash
# Conectar via serial
screen /dev/cu.usbserial-14420 115200

# No prompt MicroPython:
>>> import main  # Inicia o sistema ROS-like

💡 Exemplos Práticos
Exemplo 1: Sistema de Monitoramento Básico
Configuração (param/robot_config.json):
json
{
  "network": {
    "wifi_ssid": "MinhaRede",
    "wifi_password": "MinhaSenh@123"
  },
  "mqtt": {
    "broker": "broker.hivemq.com", 
    "port": 1883,
    "client_id": "esp8266_monitor_01"
  },
  "sensors": {
    "temperature": {
      "pin": 2,
      "publish_rate": 2.0
    }
  }
}

Deploy e Execução:
bash
# 1. Configurar parâmetros
vi src/param/robot_config.json

# 2. Deploy
make deploy-workspace

# 3. Executar
make connect
>>> import main

Saída esperada:
text
=== ESP8266 ROS-like System ===
[temperature_node] Node inicializado
[temperature_node] Publisher criado: /sensors/temperature
WiFi conectado: ('192.168.1.100', '255.255.255.0', '192.168.1.1', '8.8.8.8')
MQTT conectado (ROS Master equivalent)
=== Todos os nós inicializados ===
[temperature_node] Publicado em /sensors/temperature: {"temperature": 23.5, "unit": "C", "timestamp": 1693612800, "msg_type": "Temperature"}

Exemplo 2: Controle Remoto de LED
Terminal 1 - ESP8266:
bash
make connect
>>> import main  # Sistema iniciado

Terminal 2 - Comando Remoto:
bash
# Ligar LED com 50% de brilho
mosquitto_pub -h broker.hivemq.com -t "/actuators/led_control" \
  -m '{"led_id":0,"state":true,"brightness":128,"msg_type":"LedControl"}'

# Desligar LED  
mosquitto_pub -h broker.hivemq.com -t "/actuators/led_control" \
  -m '{"led_id":0,"state":false,"brightness":0,"msg_type":"LedControl"}'

Saída no ESP8266:
text
[led_node] LED ligado - brilho: 128
[led_node] LED desligado

Exemplo 3: Monitoramento Multi-Sensor
Criar novo nó sensor (src/sensors/humidity_node.py):
python
from communication.ros_node import ROSNode
from msg.sensor_msgs import Humidity

class HumidityNode(ROSNode):
    def __init__(self, mqtt_client=None):
        super().__init__("humidity_node", mqtt_client)
        
        # Configurar publisher
        self.create_publisher('/sensors/humidity', Humidity)
        
        # Timer para publicação
        self.create_timer(0.5, self.publish_humidity)  # 2Hz
    
    def publish_humidity(self):
        import random
        humidity_value = 45.0 + random.uniform(-10, 20)
        
        msg = Humidity(humidity=humidity_value, timestamp=time.time())
        self.publish('/sensors/humidity', msg)

Atualizar launch file:
python
# Adicionar ao robot_launch.py
from sensors.humidity_node import HumidityNode

def launch_nodes(self):
    # ... código existente ...
    
    # Nó sensor de umidade
    humidity_node = HumidityNode(self.mqtt_client)
    self.nodes.append(humidity_node)

Deploy incremental:
bash
make deploy-nodes
make deploy-launch

Exemplo 4: Sistema Multi-ESP8266
ESP8266 #1 - Sensores:
json
{
  "mqtt": {"client_id": "esp8266_sensors"},
  "sensors": {
    "temperature": {"pin": 2, "publish_rate": 1.0},
    "humidity": {"pin": 2, "publish_rate": 1.0}
  }
}

ESP8266 #2 - Atuadores:
json
{
  "mqtt": {"client_id": "esp8266_actuators"},
  "actuators": {
    "led": {"pin": 2},
    "relay": {"pin": 0}
  }
}

Comunicação entre ESPs:
bash
# ESP8266 #1 publica sensores automaticamente
# ESP8266 #2 escuta e reage a comandos

# Comando externo para acionar atuadores
mosquitto_pub -t "/actuators/led_control" -m '{"state":true}'

🛠️ Desenvolvimento Avançado
Criando um Novo Nó Sensor
1. Definir mensagem (src/msg/sensor_msgs.py):
python
class AirQuality:
    def __init__(self, co2=0, pm25=0, timestamp=0):
        self.co2 = co2
        self.pm25 = pm25
        self.timestamp = timestamp
    
    def to_dict(self):
        return {
            'co2': self.co2,
            'pm25': self.pm25, 
            'timestamp': self.timestamp,
            'msg_type': 'AirQuality'
        }

2. Implementar nó (src/sensors/air_quality_node.py):
python
from communication.ros_node import ROSNode
from msg.sensor_msgs import AirQuality

class AirQualityNode(ROSNode):
    def __init__(self, mqtt_client=None):
        super().__init__("air_quality_node", mqtt_client)
        
        self.create_publisher('/sensors/air_quality', AirQuality)
        self.create_timer(5.0, self.publish_air_quality)  # 0.2Hz
    
    def publish_air_quality(self):
        # Implementar leitura do sensor
        msg = AirQuality(co2=450, pm25=12, timestamp=time.time())
        self.publish('/sensors/air_quality', msg)

3. Deploy do novo nó:
bash
make deploy-nodes
make connect
>>> import main

Debug e Monitoramento
Logs em tempo real:
bash
# Terminal 1 - ESP8266
make connect

# Terminal 2 - Monitor MQTT
mosquitto_sub -h broker.hivemq.com -t "/sensors/#" -v
mosquitto_sub -h broker.hivemq.com -t "/actuators/#" -v

Comandos de debug no ESP8266:
python
# No prompt MicroPython
>>> import gc
>>> gc.mem_free()  # Verificar memória
>>> import uos
>>> uos.listdir('/src')  # Listar arquivos

Configurações Avançadas
WiFi com IP fixo (boot.py):
python
wlan.ifconfig(('192.168.1.100', '255.255.255.0', '192.168.1.1', '8.8.8.8'))

MQTT com SSL (para AWS IoT):
python
self.mqtt_client = MQTTClient(
    client_id=client_id,
    server=server,
    port=8883,
    ssl=True,
    ssl_params={'cert': cert, 'key': key, 'ca': ca}
)

🔧 Comandos Úteis
Deploy e Sincronização
bash
make deploy-workspace    # Deploy completo
make deploy-launch      # Deploy apenas launch files  
make deploy-nodes       # Deploy apenas nós
make list              # Listar arquivos no ESP8266
make clean             # Limpar ESP8266

Desenvolvimento
bash
make connect           # Conectar ao ESP8266
screen /dev/cu.usbserial-14420 115200  # Conexão direta
# Ctrl+A, K, Y para sair do screen

Monitoramento MQTT
bash
# Monitorar todos os tópicos
mosquitto_sub -h SEU_BROKER -t "#" -v

# Monitorar sensores específicos
mosquitto_sub -h SEU_BROKER -t "/sensors/temperature"

# Enviar comando para atuador
mosquitto_pub -h SEU_BROKER -t "/actuators/led_control" \
  -m '{"state":true,"brightness":255}'

📊 Integração com Sistemas Externos
Dashboard em Tempo Real
python
# subscriber_dashboard.py
import paho.mqtt.client as mqtt
import json

def on_message(client, userdata, message):
    topic = message.topic
    data = json.loads(message.payload.decode())
    
    if topic == "/sensors/temperature":
        print(f"🌡️  Temperatura: {data['temperature']}°C")
    elif topic == "/sensors/humidity":
        print(f"💧 Umidade: {data['humidity']}%")

client = mqtt.Client()
client.on_message = on_message
client.connect("broker.hivemq.com", 1883)
client.subscribe("/sensors/#")
client.loop_forever()

API REST Bridge
python
# flask_bridge.py
from flask import Flask, jsonify, request
import paho.mqtt.publish as publish

app = Flask(__name__)

@app.route('/led/<action>')
def control_led(action):
    state = action == 'on'
    msg = {"state": state, "brightness": 255, "msg_type": "LedControl"}
    
    publish.single("/actuators/led_control", 
                  json.dumps(msg), 
                  hostname="broker.hivemq.com")
    
    return jsonify({"status": "ok", "action": action})

app.run(port=5000)

🤝 Contribuindo
Fork o projeto
Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
Commit suas mudanças (git commit -m 'Add some AmazingFeature')
Push para a branch (git push origin feature/AmazingFeature)
Abra um Pull Request
Padrões de Desenvolvimento
Nós: Um arquivo por nó em src/sensors/ ou src/actuators/
Mensagens: Definir em src/msg/sensor_msgs.py
Configurações: JSON em src/param/
Documentação: Docstrings em todos os métodos
📝 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.
🙏 Agradecimentos
Inspirado nos projetos boulder-esp8266 e shiva-esp8266
Arquitetura baseada no ROS (Robot Operating System)
Comunidade MicroPython


Desenvolvido com ❤️ para a comunidade IoT e Robótica
