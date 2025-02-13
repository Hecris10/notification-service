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
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    depends_on:
      - zookeeper
```

### **🔹 Configure Environment Variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL=file:./notifications.db
KAFKA_BROKER=localhost:9092
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

## **🔎 Handling System Challenges**

This section addresses the **three key challenges** outlined in the project instructions.

### **1️⃣ Handling Downtime & Preventing Lost Events**

✅ **Kafka ensures message durability**

- Messages are **retained for 7 days** (`retention.ms=604800000`).
- If the service is **down**, messages remain **queued** and are processed **once the service restarts**.

### **2️⃣ Ensuring At-Least-Once Delivery**

✅ **Kafka guarantees message delivery**

- A message is **only removed after acknowledgment**.
- If processing **fails**, Kafka **retries the event automatically**.
- Our **Kafka consumer only commits offsets after successful processing**.

### **3️⃣ Handling Out-of-Order Events**

✅ **We use timestamps to ignore older events**

- If a `delivered` event **arrives before** a `sent` event, we **ignore the outdated update**.

**Example Fix in `updateStatus()`**

```ts
async updateStatus(externalId: string, status: string, timestamp: string) {
  const [existing] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.externalId, externalId))
    .limit(1);

  if (!existing || new Date(timestamp) < new Date(existing.timestamp)) {
    this.logger.warn(`Ignoring out-of-order event: ${status} for External ID: ${externalId}`);
    return;
  }

  await db.update(notifications).set({ status, timestamp }).where(eq(notifications.externalId, externalId));
}
```

---

## **📝 Contributing**

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes** and run tests
4. **Submit a Pull Request** 🚀

---

## **📜 License**

This project is **MIT licensed**. Feel free to use and modify!

---
