### **Technical Requirement Document (TRD): Boundary Guard AI**

**Version:** 1.1 (High-Level)
**Date:** November 11, 2025
**Related PRD:** 1.0

### ## 1. Introduction

This document outlines the high-level technical architecture and key approaches for implementing the **Boundary Guard AI** project. The goal is to define the technology stack and system design, not the specific implementation details.

---

### ## 2. System Architecture

The application will be a **100% client-side Single Page Application (SPA)**. All processing, including video capture, AI inference, and alert logic, will run in the user's browser. This serverless architecture is chosen for user privacy (no video data leaves the user's device) and simplicity (no backend infrastructure is required).

**High-Level Data Flow:**

1.  **Input:** The system will receive a live video feed via the `react-webcam` component and user-defined settings (the "no-go" zone and target animal list).
2.  **Processing:** A detection loop will continuously run the `coco-ssd` model on the video feed.
3.  **Logic:** The system's core logic will filter AI predictions based on user settings and perform 2D spatial calculations to check for intersections between a detected animal's bounding box and the "no-go" zone.
4.  **Output:** If the logic's conditions are met, the system will trigger browser-native alerts.

---

### ## 3. Technology Stack

| Category     | Technology    | Package Name                  | Justification                                                                                                                                                  |
| :----------- | :------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**     | React         | `react`                       | Provides a component-based UI framework.                                                                                                                       |
| **Routing**  | React Router  | `react-router-dom`            | Manages application views (e.g., main app vs. settings).                                                                                                       |
| **Styling**  | Tailwind CSS  | `tailwindcss`                 | For rapid, utility-first styling.                                                                                                                              |
| **UI Kit**   | Shadcn/ui     | `shadcn-ui`                   | Provides pre-built, accessible components.                                                                                                                     |
| **Camera**   | React Webcam  | `react-webcam`                | A standardized component for accessing the camera feed.                                                                                                        |
| **AI Core**  | TensorFlow.js | `@tensorflow/tfjs`            | The core library for running ML models in the browser.                                                                                                         |
| **AI Model** | COCO-SSD      | `@tensorflow-models/coco-ssd` | **Crucial:** This is an **object detection** model that provides the necessary bounding box (location) data, unlike classification-only models like MobileNet. |

---

### ## 4. Key Technical Approaches

#### ### 4.1. "No-Go" Zone

- **Approach:** The UI will provide an interactive overlay on the video feed. This component will be responsible for capturing user mouse-drag events to create, store, and visually render a resizable rectangular zone. The coordinates of this zone will be stored in the application's state.

#### ### 4.2. Detection & Logic

- **Approach:** A real-time detection loop will form the core of the app. This loop will asynchronously run the `coco-ssd` model.
- The system's logic will then filter the model's output (an array of predictions) to isolate the user's selected animals. A spatial geometry check will be performed to detect any overlap between the animal's bounding box and the "no-go" zone's coordinates.

#### ### 4.3. Alert System

- **Approach:** The alert system will be triggered by the detection logic. To prevent "alert spam" from a single, ongoing event, a **cooldown mechanism** will be implemented. This will ensure that after one alert is fired, a set amount of time must pass before a new alert can be triggered for the same rule. Alerts will use the native Browser Notification API and/or the Web Audio API.

---

### ## 5. State Management

- **Approach:** For the MVP, the application's state (e.g., `isMonitoring`, `zoneCoordinates`, `selectedAnimals`) will be managed within the React component tree. A simple **React Context** will be used to provide global access to these settings to avoid deep prop drilling.

---

### ## 6. Error Handling

- **Approach:** The technical design must account for and gracefully handle key failure points. The UI must clearly communicate and guide the user in the following scenarios:
  - **Camera Permission Denied:** The app must detect this and show instructions on how to grant permission.
  - **AI Model Load Failure:** The app must handle a failed model download (e.g., due to network issues) and provide a retry mechanism.
  - **Notification Permission Denied:** The app must detect this and fall back to audio-only alerts.
