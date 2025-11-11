### **Product Requirement Document (PRD): Boundary Guard AI**

**Version:** 1.0
**Date:** November 11, 2025
**Author:** @dannycahyo

---

### **1. Introduction & Vision**

**Boundary Guard AI** is a flexible, browser-based monitoring application that allows users to create virtual boundaries for their pets or other animals. It uses a device's webcam and real-time object detection to identify when a specified animal enters a user-defined "no-go" zone, triggering an immediate alert.

**The Vision:** To provide a simple, non-invasive, and highly customizable way for users to protect their space, train their pets, and gain peace of mind without the need for physical fences or expensive hardware. From keeping a cat off a kitchen counter to preventing chickens from wandering into a terrace garden, Boundary Guard AI acts as a smart, virtual guardian.

---

### **2. Target Audience**

- **Pet Owners:** Individuals living in apartments or houses who want to train their pets (cats, dogs) to stay off specific furniture or out of certain rooms.
- **Home Gardeners & Urban Farmers:** Users with small gardens, patios, or terraces who need to protect their plants from animals like birds (chickens, hens), rabbits, or squirrels.
- **Parents with Toddlers:** A secondary audience who can configure the app to monitor for a "person" (their toddler) getting too close to a potentially unsafe area (e.g., a fireplace, an open door).
- **Small Shop Owners:** People who want a simple way to be alerted if a stray animal wanders into their storefront.

---

### **3. User Goals & Problems**

| User Goal                                                                 | Problem Solved                                                                                                                       |
| :------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| "I want to keep my cat off the kitchen counter."                          | The app provides consistent, 24/7 monitoring and immediate alerts, aiding in behavioral training without constant human supervision. |
| "I need to protect my terrace vegetable patch from my chickens."          | Acts as a virtual scarecrow, instantly notifying the user when a chicken crosses the boundary so they can intervene.                 |
| "I don't want to install ugly physical gates or fences."                  | Offers a completely virtual and flexible solution that can be set up, changed, or removed instantly.                                 |
| "I need a solution that works for different animals and different areas." | The core functionality is fully configurable, allowing the user to select the animal and draw the precise zone they need to protect. |

---

### **4. Features & Scope (Minimum Viable Product - MVP)**

The MVP will focus on the core user journey: **Define, Monitor, and Alert.**

| Feature ID | Feature Name                             | Description                                                                                                                                                                                                                                          |
| :--------- | :--------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FE-01**  | **Live Camera Feed**                     | The application will display a real-time feed from the user's chosen webcam.                                                                                                                                                                         |
| **FE-02**  | **Configurable Target Animal Selection** | The user will be presented with a list of common animals that the AI model can detect (e.g., Cat, Dog, Bird, Bear, Horse). The user can select one or more animals to monitor.                                                                       |
| **FE-03**  | **Interactive "No-Go" Zone Creator**     | The user can click and drag directly on the live video feed to draw a resizable rectangular "no-go" zone. The zone will be visualized as a semi-transparent colored overlay.                                                                         |
| **FE-04**  | **Real-time Boundary Detection**         | The app runs the object detection model on the video feed. The core logic will continuously check if the bounding box of a selected target animal **intersects** with the user-defined "no-go" zone.                                                 |
| **FE-05**  | **Alert System**                         | When a boundary breach is detected, the app will trigger an immediate alert. The MVP will include: <br> • **Desktop Notification:** A native browser notification will pop up. <br> • **Audio Alert:** An optional, audible chime or beep will play. |
| **FE-06**  | **Monitoring Controls**                  | Simple "Start Monitoring" and "Stop Monitoring" buttons to activate and deactivate the detection logic.                                                                                                                                              |

---

### **5. User Flow**

1.  **Open App:** The user navigates to the web application.
2.  **Grant Permission:** The browser prompts for and receives camera access.
3.  **Setup View:** The user is presented with the camera feed and setup controls.
4.  **Step 1: Select Animal:** The user sees a list of animals. They check the box next to **"Bird"** (for their chickens).
5.  **Step 2: Define Zone:** A prompt says, "Click and drag on the screen to draw your no-go zone." The user draws a rectangle over their vegetable patch on the terrace. They can adjust the corners of the rectangle.
6.  **Step 3: Start Monitoring:** The user clicks the "Start Monitoring" button. The setup controls hide, and a "Monitoring Active" indicator appears.
7.  **Detection:** A few minutes later, a chicken wanders from the allowed area of the terrace into the protected vegetable patch.
8.  **Alert:** A desktop notification immediately appears on the user's computer stating: **"Boundary Guard AI Alert: 'Bird' detected in your defined zone\!"** A chime sound also plays.
9.  **Stop:** The user addresses the situation and later clicks "Stop Monitoring" to end the session.

---

### **6. Future Scope (Post-MVP)**

- **Multiple Zones:** Allow users to draw and manage several "no-go" zones simultaneously, each with its own set of rules.
- **Advanced Rules:** Enable different rules for different animals (e.g., "Alert for 'dog' in Zone A, but not for 'cat'").
- **"Go" Zones (Safe Zones):** The inverse of a no-go zone. Alert the user when a pet enters a designated safe area (e.g., their bed).
- **Event Log with Snapshots:** Keep a timestamped log of all boundary breaches, including a saved image of the event for later review.
- **Advanced Notifications:** Integrate with services like email or push notification APIs (e.g., Pushover) to send alerts to the user's phone when they are away from the computer.
- **Sensitivity Controls:** Add a slider to control how much of the animal's bounding box must overlap with the zone to trigger an alert, reducing false positives.
