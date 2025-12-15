# OptiPack AI - Knapsack Explorer

An interactive educational platform designed to bridge the gap between classical combinatorial optimization and modern Reinforcement Learning (RL) approaches, powered by Google Gemini 2.5 Flash.

## 🚀 Overview

OptiPack AI helps students, developers, and researchers understand the **Knapsack Problem**—a fundamental problem in computer science and operations research. 

Unlike static tutorials, this application offers a dynamic playground where you can:
1.  **Visualize** algorithms solving the problem in real-time.
2.  **Generate** realistic business scenarios using Generative AI.
3.  **Explore** how Reinforcement Learning (Deep RL) tackles complex variations of this problem compared to classical Dynamic Programming.

## ✨ Key Features

### 1. Interactive Visualizer
*   **Dynamic Solver**: Run exact **Dynamic Programming (DP)** algorithms alongside **Greedy heuristics** to compare performance and optimality.
*   **Custom Scenarios**: Manually add items or let AI generate realistic datasets (e.g., "Cargo Loading for a Maersk Ship" or "Survival Kit Packing").
*   **Visual Feedback**: Real-time charts showing value density and capacity utilization.

### 2. Reinforcement Learning Hub
*   **Theory to Practice**: Learn how to map the Knapsack problem to an RL framework (State, Action, Reward).
*   **Algorithm Comparison**: Detailed comparisons between classical methods and Policy Gradient methods (e.g., Pointer Networks).
*   **AI Deep Dives**: Request on-demand explanations for complex topics like Q-Learning or Markov Decision Processes.

### 3. Real-World Applications
*   Discover how companies use these algorithms in **Logistics**, **Financial Portfolio Optimization**, and **Cloud Resource Scheduling**.
*   Learn about industry-standard tools like **Google OR-Tools**, **SciPy**, and **Gurobi**.

### 4. AI Expert Chat
*   Integrated Chat interface powered by **Gemini 2.5 Flash**.
*   Context-aware assistance for questions about implementation details in Python/C++ or theoretical constraints.

## 🛠️ Tech Stack

*   **Frontend**: React 18 with TypeScript
*   **Styling**: Tailwind CSS
*   **Visualization**: Recharts
*   **AI Engine**: Google GenAI SDK (`@google/genai`) - Gemini 2.5 Flash model
*   **Icons**: Lucide React

## 🧠 Concepts Covered

*   **0/1 Knapsack Problem**: The classic NP-Hard problem.
*   **Dynamic Programming**: `O(nW)` exact solution logic.
*   **Greedy Algorithms**: `O(n log n)` approximation strategies based on value density.
*   **Reinforcement Learning**:
    *   State Space Representation
    *   Reward Shaping
    *   Policy Gradients vs Value-based methods
*   **Combinatorial Optimization**: Mixed Integer Programming (MIP) contexts.

## 📄 License

MIT