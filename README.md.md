# 🚀 Cloud-Native Todo Application (Full-Stack + DevOps)

---

## 📌 Project Overview

This is a **cloud-native full-stack Todo application** built to demonstrate real-world development + DevOps workflow.

You can:
- Add tasks
- Update tasks
- Delete tasks
- Track completion

This project focuses on **end-to-end deployment** using modern tools.

---

## 🏗️ Architecture

```
User (Browser)
   ↓
Frontend (React + Nginx)
   ↓
Backend (Node.js API)
   ↓
AWS DynamoDB
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML / CSS / JS
- Nginx

### Backend
- Node.js
- Express.js

### Database
- AWS DynamoDB

### DevOps
- Docker
- Docker Hub
- Kubernetes (Minikube)

---

## ⚙️ Features

- Add Todo
- Update Todo
- Delete Todo
- Mark Complete
- Real-time updates
- Cloud storage

---

## 🐳 Docker (Containerization)

### What it does
Packages app + dependencies → runs anywhere

### Commands

```bash
cd frontend
docker build -t deploy-frontend .

cd ../backend
docker build -t deploy-backend .
```

---

## ☁️ Docker Hub (Registry)

### What it does
Stores images online

```bash
docker login

docker tag deploy-frontend <username>/deploy-frontend:latest
docker tag deploy-backend <username>/deploy-backend:latest

docker push <username>/deploy-frontend:latest
docker push <username>/deploy-backend:latest
```

---

## ☸️ Kubernetes (Orchestration)

### What it does
Runs & manages containers

```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

---

## 🟢 Minikube (Local Cluster)

```bash
minikube start
minikube service frontend-service
```

---

## ☁️ AWS DynamoDB

- Table: `Todos`
- Primary Key: `id (String)`
- Serverless NoSQL DB

---

## 🔥 Full Workflow

```bash
# Clone repo
git clone <repo>
cd project

# Run docker
docker-compose up --build

# Start k8s
minikube start

# Deploy
kubectl apply -f .

# Open app
minikube service frontend-service
```

---

## ⚠️ Key Fixes Learned

- `_id` → `id` (DynamoDB)
- Use `/api` for routing
- Use `backend-service` (not localhost)
- Add AWS keys in YAML
- Match AWS region

---

## 🛑 Stop Everything

```bash
minikube stop
docker ps
docker stop <id>
```

---

## 🏆 What I Learned

- Full-stack development
- Cloud database integration
- Docker containerization
- Kubernetes deployment
- Debugging real-world systems

---

## 👨‍💻 Author

Shakthi Lakshmanan

---

## 🌟 Final Thought

> "First you make it work. Then you make it scalable. Then you make it unstoppable."
