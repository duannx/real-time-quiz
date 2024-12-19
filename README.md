# Design Real-Time Vocabulary Quiz

## **1. Requirements**

### **Functional Requirements**

**User**

- Users can join a quiz session using a unique quiz ID.
- The system supports multiple users in the same quiz session.
- Users' scores update in real-time as they submit answers.
- A real-time leaderboard reflects the standings of participants promptly.

**Administrator**

- CRUD questions
- CRUD quizzes
- Statistics

### **Non-Functional Requirements**

- **Scalability**: Handle high concurrent users and multiple active quiz sessions.
- **Performance**: Ensure low latency for score updates and leaderboard changes.
- **Reliability**: System should remain available and accurate under heavy load.
- **Maintainability**: Codebase should be easy to understand and extend.
- **Observability**: Allow monitoring of quiz sessions and system health.

## **2. Estimation**

### **Traffic Estimation:**

1. **Daily Active Users**: 10,000 users.
2. **Peak Concurrent Users**: 1,000 users.
3. **Average users per quiz**: 100 users/quiz.
4. **Average answers per user per second**: 0.3 answers/s (3s for 1 question).
5. **Requests per second:**
    - Get answer: 1,000 * 0.3 = **300 qps**
    - Write answer: 1,000 * 0.3 = **300 qps**
    - Read Leaderboard: 300 * 100 = **30,000 qps**

### **Storage Estimation:**

1. **Question Bank**: 1M questions (~10 KB each) → ~10 GB.
2. **User Data**:
    - Profiles: 1M users × 10 KB → ~10 GB.
    - Quiz History: 1M users × 1 MB → ~1 TB.

## 3. API Design

- **joinQuiz(quizId)**: Returns `successStatus`, `questionList`, and `JWT`.
- **answer(questionId, choice, JWT)**: Returns `result` and `deltaScore`.
    - `questionId` and `JWT` can be used as an idempotent key.
    - `JWT` to determine whether the user has joined the quiz or not
- **viewLeaderboard(quizId)**: Returns `leaderboard`.

## **4. Database Design**

### **User Table**

| **Column Name** | **Data Type** |
| --- | --- |
| id | UUID/INT |
| name | VARCHAR(255) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### **Question Table**

| **Column Name** | **Data Type** |
| --- | --- |
| id | UUID/INT |
| title | TEXT |
| choices | JSONB |
| correct_choice | INT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### **Quiz Table**

| **Column Name** | **Data Type** |
| --- | --- |
| id | UUID/INT |
| title | VARCHAR(255) |
| status | ENUM |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

### **Question_In_Quiz Table**

| **Column Name** | **Data Type** |
| --- | --- |
| question_id | UUID/INT |
| quiz_id | UUID/INT |
| score | INT |
| created_at | TIMESTAMP |

### **Answer Table**

| **Column Name** | **Data Type** |
| --- | --- |
| question_id | UUID/INT |
| quiz_id | UUID/INT |
| user_id | UUID/INT |
| choice | INT |
| created_at | TIMESTAMP |

### **Scores Table**

| **Column Name** | **Data Type** |
| --- | --- |
| user_id | UUID/INT |
| quiz_id | UUID/INT |
| score | INT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## 5. High-level design

![detailed-design.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/95fbcf0b-770c-4279-b7a0-f6728eda88a9/2f7940b6-4e38-4733-abed-48364889e658/detailed-design.png)

## 6. Components Description

### **Load Balancer**

- Distributes traffic evenly across service instances for optimal resource usage and high availability.
- Each service has its own load balancer, enabling independent scaling and ensuring minimal downtime.

### **Database**

- Stores persistent data, such as quizzes, questions, answers, and scores, using a SQL-based relational database system.

### **Quiz Service**

- Manages user participation in quizzes, handling join requests and ensuring the proper state of each quiz session.

### **Question Service**

- Retrieves and serves questions for a specific quiz.
- Handles user answers, validates them, and calculates scores for each question.
- Pushes user answers and scores to the **Score Queue** for processing. Each quiz has its own topic.
- The **Score Queue** can prevent the **Question Service** from flooding the **Score Service** and act as temporary storage for scores during service downtime, enhancing both system reliability and performance.

### **Score Service**

- Responsible for calculating user scores after each answer submission.
- Manages the leaderboard using **Redis Sorted Sets** for efficient storage and retrieval of rankings.
- Pushes updated leaderboard data to the **Leaderboard Queue**, which the **Leaderboard Service** will consume and send to clients.

### **Leaderboard Service**

- Subscribes to the Leaderboard queue to receive the latest leaderboard updates and sends them to all clients.
- Each quiz has its own topic. We can configure it to process only the latest message of the topic and ignore older ones to improve performance.
- Uses **Server-Sent Events (SSE)** to stream real-time leaderboard updates to connected clients. Choosing SSE over WebSocket because, in this case, we only need to handle heavy data transfer from the server to the client. Using SSE reduces overhead and simplifies both implementation and maintenance

### **Monitoring**

- Uses health check to periodically monitor the server's ability to balance requests and automatic alerts for failure scenarios.
- Implements **OpenTelemetry** to trace requests and detect performance issues.
- Uses **queue monitoring** to ensure message queues are processing efficiently and to detect any message backlog.

## Demo
https://real-time-quiz.vercel.app/ 