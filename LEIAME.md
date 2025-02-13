# **📢 Serviço de Notificação - NestJS & Kafka**

🚀 Um **serviço de notificação** robusto construído com **NestJS, Kafka e Drizzle ORM** para gerenciar **atualizações de status em tempo real** para notificações via SMS e WhatsApp.

---

## **📖 Tabela de Conteúdo**

- [📌 Visão Geral](#-visão-geral)
- [⚡ Recursos](#-recursos)
- [🛠️ Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🚀 Como Começar](#-como-começar)
- [📡 Endpoints da API](#-endpoints-da-api)
- [🔌 Integração com Kafka](#-integração-com-kafka)
- [🔎 Lidando com Desafios do Sistema](#-lidando-com-desafios-do-sistema)
- [📝 Contribuição](#-contribuição)
- [📜 Licença](#-licença)

---

## **📌 Visão Geral**

Este **serviço de notificação** processa e gerencia **notificações via SMS e WhatsApp**.  
Ele se integra com **Kafka** para garantir um **streaming de eventos confiável** e utiliza **Drizzle ORM** com **SQLite** para operações no banco de dados.

✅ **Principais Responsabilidades:**

- **Enviar notificações** via um provedor externo.
- **Processar atualizações de webhook** para alteração de status.
- **Transmitir eventos** para o **Kafka** para fluxo de dados em tempo real.
- **Garantir a ordenação das mensagens** e **lidar com falhas** de maneira eficiente.

---

## **⚡ Recursos**

✅ **API REST** para gerenciamento de notificações  
✅ **Streaming de eventos com Kafka** para mudanças de status  
✅ **Suporte a Webhook** para receber atualizações externas de status  
✅ **Garante entrega de mensagens pelo menos uma vez**  
✅ **Lida com eventos fora de ordem**  
✅ **Banco de dados SQLite com Drizzle ORM**  
✅ **Logging e monitoramento robustos**

---

## **🛠️ Tecnologias Utilizadas**

| Tecnologia      | Propósito                       |
| --------------- | ------------------------------- |
| **NestJS**      | Framework para API              |
| **Kafka**       | Streaming de eventos            |
| **Drizzle ORM** | Gerenciamento de banco de dados |
| **SQLite**      | Banco de dados                  |
| **Zod**         | Validação de esquemas           |
| **Jest**        | Testes unitários                |
| **TypeScript**  | Tipagem estática                |
| **Docker**      | Configuração do ambiente        |

---

## **🚀 Como Começar**

### **🔹 Pré-requisitos**

Certifique-se de ter os seguintes requisitos instalados:

- **Node.js** (recomenda-se LTS)
- **pnpm** (gerenciador de pacotes)
- **Docker & Docker Compose** (para rodar o Kafka localmente)

### **🔹 Clonar o Repositório**

```sh
git clone <repository-url>
cd notification-service
```

### **🔹 Instalar Dependências**

```sh
pnpm install
```

### **🔹 Iniciar o Kafka com Docker**

Se estiver rodando o Kafka localmente, inicie-o usando Docker:

```sh
docker-compose up -d
```

Se ainda não tiver um arquivo `docker-compose.yml`, crie um com o seguinte conteúdo:

```yaml
version: '3'
services:
  zookeeper:
    image: wurstmeister/zookeeper
    ports:
      - '2181:2181'

  kafka:
    image: wurstmeister/kafka
    ports:
      - '9092:9092'
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    depends_on:
      - zookeeper
```

### **🔹 Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do diretório:

```env
DATABASE_URL=file:./notifications.db
KAFKA_BROKER=kafka:9092
```

### **🔹 Executar Migrações do Banco de Dados**

```sh
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### **🔹 Iniciar a Aplicação**

```sh
pnpm run start
```

### **🔹 Executar Testes**

```sh
pnpm test
```

---

## **📡 Endpoints da API**

### **🔹 Enviar uma Notificação**

```http
POST /notifications
```

**Corpo da Requisição:**

```json
{
  "channel": "sms",
  "to": "+5511999999999",
  "body": "Olá, esta é uma notificação de teste!",
  "externalId": "notif-123"
}
```

### **🔹 Obter Status da Notificação**

```http
GET /notifications?externalId=notif-123
```

### **🔹 Webhook para Atualizações de Status**

```http
POST /webhooks
```

**Corpo da Requisição:**

```json
{
  "externalId": "notif-123",
  "event": "delivered"
}
```

---

## **🔌 Integração com Kafka**

| Evento                 | Tópico do Kafka              | Propósito                               |
| ---------------------- | ---------------------------- | --------------------------------------- |
| **Notificação Criada** | `notification.status.change` | Enviado quando uma notificação é criada |
| **Status Atualizado**  | `notification.status.change` | Transmitido quando um status muda       |

---

## **📝 Contribuição**

1. **Faça um fork do repositório**
2. **Crie um branch para sua funcionalidade**
3. **Faça suas alterações** e rode os testes
4. **Envie um Pull Request** 🚀

---

## **📜 Licença**

Este projeto está sob a **licença MIT**. Fique à vontade para usar e modificar!
