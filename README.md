# **📢 Notification Service - NestJS & Kafka**

🚀 A robust **notification service** built with **NestJS, Kafka, and Drizzle ORM** to handle **real-time status updates** for SMS and WhatsApp notifications.

---

## **📖 Table of Contents**

- [📌 Overview](#-overview)
- [⚡ Features](#-features)
- [🛠️ Technologies Used](#-technologies-used)
- [🚀 Getting Started](#-getting-started)
- [📡 API Endpoints](#-api-endpoints)
- [🔌 Kafka Integration](#-kafka-integration)
- [🔎 Handling System Challenges](#-handling-system-challenges)
- [📝 Contributing](#-contributing)
- [📜 License](#-license)

---

## **📌 Overview**

This **notification service** processes and manages **SMS** and **WhatsApp notifications**.  
It integrates with **Kafka** to ensure reliable **event streaming** and uses **Drizzle ORM** with **SQLite** for database operations.

✅ **Main Responsibilities:**

- **Send notifications** via an external provider.
- **Process webhook updates** for status changes.
- **Stream events** to **Kafka** for real-time data flow.
- **Ensure message ordering** and **handle failures** gracefully.

---

## **⚡ Features**

✅ **REST API** for managing notifications  
✅ **Kafka-based event streaming** for status changes  
✅ **Webhook support** for receiving external status updates  
✅ **Ensures at-least-once message delivery**  
✅ **Handles out-of-order events**  
✅ **SQLite database with Drizzle ORM**  
✅ **Robust logging and monitoring**

---

## **🛠️ Technologies Used**

| Technology      | Purpose             |
| --------------- | ------------------- |
| **NestJS**      | API framework       |
| **Kafka**       | Event streaming     |
| **Drizzle ORM** | Database management |
| **SQLite**      | Database            |
| **Zod**         | Schema validation   |
| **Jest**        | Unit testing        |
| **TypeScript**  | Type safety         |
| **Docker**      | Environment setup   |

---

## **🚀 Getting Started**

### **🔹 Prerequisites**

Make sure you have the following installed:

- **Node.js** (LTS recommended)
- **pnpm** (package manager)
- **Docker & Docker Compose** (for running Kafka locally)

### **🔹 Clone the Repository**

```sh
git clone <repository-url>
cd notification-service
```

### **🔹 Install Dependencies**

```sh
pnpm install
```

### **🔹 Start Kafka with Docker**

If you're running Kafka locally, start it using Docker:

```sh
docker-compose up -d
```

If you don’t have a `docker-compose.yml` file yet, create one with the following content:

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

### **🔹 Configure Environment Variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL=file:./notifications.db
KAFKA_BROKER=kafka:9092
```

### **🔹 Run Database Migrations**

```sh
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### **🔹 Start the Application**

```sh
pnpm run start
```

### **🔹 Run Tests**

```sh
pnpm test
```

---

## **📡 API Endpoints**

### **🔹 Send a Notification**

```http
POST /notifications
```

**Request Body:**

```json
{
  "channel": "sms",
  "to": "+5511999999999",
  "body": "Hello, this is a test notification!",
  "externalId": "notif-123"
}
```

### **🔹 Get Notification Status**

```http
GET /notifications?externalId=notif-123
```

### **🔹 Webhook for Status Updates**

```http
POST /webhooks
```

**Request Body:**

```json
{
  "externalId": "notif-123",
  "event": "delivered"
}
```

---

## **🔌 Kafka Integration**

| Event                    | Kafka Topic                  | Purpose                             |
| ------------------------ | ---------------------------- | ----------------------------------- |
| **Notification Created** | `notification.status.change` | Sent when a notification is created |
| **Status Updated**       | `notification.status.change` | Broadcasted when a status changes   |

Kafka ensures **at-least-once delivery** so **no status updates are lost**.

---

## **🔎 Improving System Resilience & Future Enhancements**

### **📌 How to Improve Around These Challenges**

The notification system is expected to **support new channels** with unique status transitions. To ensure **scalability and reliability**, we address key challenges and suggest improvements:

### **1️⃣ What if Our Application is Down?**

**Problem:** If our service is unavailable, webhook status updates may be lost.  
**Solution:**

- **Use Kafka as a Buffer**: Instead of webhooks calling our API directly, route them to **Kafka first**.
- **Retry Mechanism:** If Kafka fails, set a **retry policy** using **Kafka’s message retention** (e.g., 7 days).
- **Ensure Stateless Services:** Deploy our API in a **distributed environment** using **Docker Swarm or Kubernetes** to minimize downtime.

### **2️⃣ Ensuring Events Are Delivered At Least Once**

**Problem:** We must guarantee that **every event is processed at least once**.  
**Solution:**

- **Use Kafka with Consumer Offsets**: Kafka ensures that **messages are only removed once processed successfully**.
- **Idempotent Processing:** Each event contains a **unique ID**, ensuring duplicate events are ignored.
- **Monitoring & Alerting:** Use **Prometheus** or **Grafana** to monitor Kafka lag.

### **3️⃣ Handling Out-of-Order Events**

**Problem:** External services may **send status updates out of order**.  
**Solution:**

- **Timestamp Comparison:** Store the **latest timestamp** in the database and **ignore older events**.
- **Kafka Message Ordering:** Use **Kafka partitions** to ensure messages for a single notification **are always processed in order**.
- **Event Deduplication:** Implement **a cache** (e.g., Redis) to **ignore duplicate updates**.

### **🔥 Future Enhancements**

- **Support More Notification Channels:** Extend the system to **email, push notifications, and more.**
- **Scalability with Multiple Kafka Consumers:** Deploy multiple consumer instances for **higher throughput**.
- **Real-Time Monitoring Dashboard:** Use **Kafka UI** to track events visually.

✅ **By implementing these strategies, the notification system will be highly resilient, scalable, and future-proof.** 🚀

---

## **📝 Contributing**

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes** and run tests
4. **Submit a Pull Request** 🚀

---

## **📜 License**

This project is **MIT licensed**. Feel free to use and modify!
