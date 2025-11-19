# Zone Guardian - Architecture Diagrams

This document contains visual representations of the Zone Guardian system architecture.

## 1. System Overview

```mermaid
flowchart TB
    subgraph Browser["Browser Environment"]
        subgraph UI["UI Layer"]
            Home[Home Page]
            Monitor[Monitor Page]
        end

        subgraph Components["Components Layer"]
            Camera[CameraFeed]
            ZoneDrawer[ZoneDrawer]
            AnimalSelector[AnimalSelector]
            AlertSettings[AlertSettings]
            Controls[MonitoringControls]
            Canvas[DetectionCanvas]
        end

        subgraph State["State Management"]
            Context[MonitoringContext]
            Reducer[monitoringReducer]
        end

        subgraph Hooks["Custom Hooks"]
            Detection[useObjectDetection]
            Alerts[useAlertManager]
        end

        subgraph External["External APIs"]
            Webcam[react-webcam]
            TF[TensorFlow.js]
            Model[COCO-SSD Model]
            Notification[Browser Notification API]
            Audio[HTML5 Audio API]
        end
    end

    Monitor --> Components
    Components --> State
    Components --> Hooks
    Hooks --> State
    Hooks --> External
    Camera --> Webcam
    Detection --> TF
    Detection --> Model
    Alerts --> Notification
    Alerts --> Audio
    Canvas -.renders.-> Camera

    style Browser fill:#e1f5ff
    style External fill:#fff4e1
    style State fill:#e8f5e9
    style Hooks fill:#f3e5f5
```

## 2. Component Hierarchy

```mermaid
flowchart TD
    Root[root.tsx<br/>App Root] --> EB[ErrorBoundary]
    EB --> MP[MonitoringProvider<br/>Context Wrapper]
    MP --> Router[React Router Outlet]

    Router --> Home[home.tsx<br/>Landing Page]
    Router --> MonitorPage[monitor.tsx<br/>Main Page]

    MonitorPage --> CF[CameraFeed<br/>Video + Canvas]
    MonitorPage --> MC[MonitoringControls<br/>Start/Stop]
    MonitorPage --> AS[AnimalSelector<br/>Animal Checkboxes]
    MonitorPage --> ZD[ZoneDrawer<br/>Zone Editor]
    MonitorPage --> AlertS[AlertSettings<br/>Audio + Notifications]
    MonitorPage --> Status[Detection Status Panel]

    CF --> Webcam[Webcam Component<br/>react-webcam]
    CF --> DC[DetectionCanvas<br/>Bounding Box Overlay]

    style Root fill:#ffcdd2
    style MP fill:#c8e6c9
    style MonitorPage fill:#bbdefb
    style CF fill:#fff9c4
```

## 3. State Management Architecture

```mermaid
flowchart TB
    subgraph Context["MonitoringContext"]
        State["MonitoringState<br/>• isMonitoring<br/>• zone<br/>• selectedAnimals<br/>• alertConfig<br/>• lastAlertTime"]
        Dispatch[Dispatch Function]
    end

    subgraph Reducer["monitoringReducer"]
        Actions["Actions<br/>• SET_IS_MONITORING<br/>• SET_ZONE<br/>• TOGGLE_ANIMAL<br/>• SET_ALERT_CONFIG<br/>• UPDATE_LAST_ALERT_TIME<br/>• RESET_STATE"]
    end

    subgraph Hooks["Context Hooks"]
        UM[useMonitoring<br/>returns state + dispatch]
        UMS[useMonitoringState<br/>returns state only]
        UMD[useMonitoringDispatch<br/>returns dispatch only]
    end

    subgraph Consumers["Components"]
        C1[MonitoringControls]
        C2[AnimalSelector]
        C3[ZoneDrawer]
        C4[AlertSettings]
        C5[monitor.tsx]
    end

    State --> UM
    Dispatch --> UM
    UM --> UMS
    UM --> UMD

    UMS --> Consumers
    UMD --> Consumers
    Consumers -.dispatch.-> Actions
    Actions --> Reducer
    Reducer -.updates.-> State

    style Context fill:#e8f5e9
    style Reducer fill:#fff3e0
    style Hooks fill:#f3e5f5
    style Consumers fill:#e1f5ff
```

## 4. Data Flow - Detection Pipeline

```mermaid
sequenceDiagram
    participant User
    participant Monitor as monitor.tsx
    participant Context as MonitoringContext
    participant Detection as useObjectDetection
    participant Alert as useAlertManager
    participant AI as TensorFlow.js/COCO-SSD
    participant Canvas as DetectionCanvas
    participant Browser as Browser APIs

    User->>Monitor: Click "Start Monitoring"
    Monitor->>Context: dispatch(SET_IS_MONITORING, true)
    Context-->>Detection: isMonitoring = true

    loop Every 500ms
        Detection->>AI: model.detect(videoElement)
        AI-->>Detection: predictions array
        Detection->>Detection: Filter by selectedAnimals
        Detection->>Detection: Check zone intersection

        alt Breach Detected
            Detection->>Monitor: onBoundaryBreach()
            Monitor->>Alert: triggerAlert()

            alt Cooldown Expired
                Alert->>Context: dispatch(UPDATE_LAST_ALERT_TIME)
                Alert->>Browser: Show Notification
                Alert->>Browser: Play Audio
            else Within Cooldown
                Alert-->>Alert: Skip (cooldown active)
            end
        end

        Detection-->>Monitor: detections array
        Monitor->>Canvas: Pass detections
        Canvas->>Canvas: Render bounding boxes
    end

    User->>Monitor: Click "Stop Monitoring"
    Monitor->>Context: dispatch(SET_IS_MONITORING, false)
    Context-->>Detection: isMonitoring = false
    Detection->>Detection: Clear detection loop
```

## 5. Component Integration Map

```mermaid
flowchart LR
    subgraph monitor["monitor.tsx - Main Orchestrator"]
        Logic[Component Logic<br/>• Manages hooks<br/>• Handles callbacks<br/>• Orchestrates flow]
    end

    subgraph hooks["Custom Hooks"]
        OD[useObjectDetection<br/>• Loads AI model<br/>• Runs detection loop<br/>• Checks intersections]
        AM[useAlertManager<br/>• Triggers notifications<br/>• Plays audio<br/>• Manages cooldown]
    end

    subgraph components["UI Components"]
        CF[CameraFeed<br/>Video + Canvas]
        AS[AnimalSelector<br/>Animal Selection]
        ZD[ZoneDrawer<br/>Zone Editor]
        MC[MonitoringControls<br/>Start/Stop]
        AlertS[AlertSettings<br/>Alert Config]
    end

    subgraph state["State (Context)"]
        CS[MonitoringContext<br/>Global State]
    end

    subgraph apis["External APIs"]
        Webcam[react-webcam]
        TF[TensorFlow.js]
        Notif[Notification API]
        Audio[Audio API]
    end

    Logic --> OD
    Logic --> AM
    Logic --> components

    OD -.reads.-> CS
    AM -.reads.-> CS
    components -.dispatch.-> CS

    OD --> TF
    CF --> Webcam
    AM --> Notif
    AM --> Audio

    CF -.videoElement.-> OD
    OD -.detections.-> CF
    OD -.onBreach.-> AM

    style monitor fill:#bbdefb
    style hooks fill:#f3e5f5
    style components fill:#c8e6c9
    style state fill:#fff9c4
    style apis fill:#ffccbc
```

## 6. Detection Loop Flow

```mermaid
flowchart TD
    Start([Monitoring Active]) --> Wait[Wait 500ms]
    Wait --> Capture[Capture Video Frame]
    Capture --> Inference[AI Inference<br/>model.detect]
    Inference --> Predictions[Raw Predictions Array]

    Predictions --> Filter{Filter by<br/>Selected Animals}
    Filter --> Transform[Transform to<br/>Detection Format]

    Transform --> Check{Check Zone<br/>Intersection}

    Check -->|Breach| Breach[Set breachDetected = true]
    Check -->|No Breach| NoBreach[Set breachDetected = false]

    Breach --> Callback[Call onBoundaryBreach]
    Callback --> Alert{Cooldown<br/>Expired?}

    Alert -->|Yes| Trigger[Trigger Alert<br/>• Notification<br/>• Audio]
    Alert -->|No| Skip[Skip Alert]

    Trigger --> Update1[Update State]
    Skip --> Update1
    NoBreach --> Update1

    Update1[Update detections Array] --> Render[Render on Canvas]
    Render --> Continue{Still<br/>Monitoring?}

    Continue -->|Yes| Wait
    Continue -->|No| End([Stop])

    style Start fill:#c8e6c9
    style Inference fill:#bbdefb
    style Breach fill:#ffcdd2
    style Trigger fill:#fff59d
    style End fill:#cfd8dc
```

## 7. User Interaction Flow

```mermaid
flowchart TD
    Start([User Opens /monitor]) --> Init[Initialize Components]
    Init --> Camera{Camera<br/>Access?}

    Camera -->|Denied| Error1[Show Error Message]
    Camera -->|Granted| LoadModel[Load COCO-SSD Model]

    LoadModel --> Ready[Ready State]

    Ready --> Config[User Configuration]
    Config --> SelectAnimals[Select Animals to Monitor]
    Config --> DrawZone[Draw Restricted Zone]
    Config --> SetupAlerts[Configure Alerts<br/>Audio + Notifications]

    SelectAnimals --> Validate{Ready to<br/>Start?}
    DrawZone --> Validate
    SetupAlerts --> Validate

    Validate -->|Missing Config| Config
    Validate -->|Complete| Enable[Enable Start Button]

    Enable --> StartBtn[User Clicks<br/>"Start Monitoring"]
    StartBtn --> Monitor[Begin Detection Loop]

    Monitor --> DetectLoop{Detection<br/>Running}
    DetectLoop -->|Breach| Alert[Show Alert]
    DetectLoop -->|No Breach| Continue[Continue Monitoring]

    Alert --> Continue
    Continue --> Stop{User Clicks<br/>Stop?}

    Stop -->|No| DetectLoop
    Stop -->|Yes| StopMonitor[Stop Monitoring]
    StopMonitor --> Ready

    style Start fill:#c8e6c9
    style Monitor fill:#bbdefb
    style Alert fill:#ffcdd2
    style Ready fill:#fff9c4
```

## 8. Technology Stack Layers

```mermaid
flowchart TB
    subgraph Presentation["Presentation Layer"]
        React[React 19<br/>Component-based UI]
        Router[React Router 7<br/>File-based routing]
        Tailwind[Tailwind CSS 4<br/>Utility-first styling]
        Shadcn[Shadcn/ui<br/>UI Components]
    end

    subgraph Logic["Business Logic Layer"]
        Hooks[Custom Hooks<br/>useObjectDetection<br/>useAlertManager]
        Context[State Management<br/>Context + useReducer]
        Types[TypeScript Definitions<br/>Type Safety]
    end

    subgraph Integration["Integration Layer"]
        Camera[Camera Integration<br/>react-webcam]
        AI[AI Integration<br/>TensorFlow.js + COCO-SSD]
        Alerts[Alert Integration<br/>Notification + Audio APIs]
    end

    subgraph Browser["Browser APIs"]
        MediaAPI[MediaDevices API<br/>Camera Access]
        WebGL[WebGL<br/>AI Inference]
        NotifAPI[Notification API<br/>Desktop Alerts]
        AudioAPI[Audio API<br/>Sound Playback]
    end

    Presentation --> Logic
    Logic --> Integration
    Integration --> Browser

    React -.uses.-> Hooks
    Hooks -.uses.-> Context
    Hooks -.uses.-> Integration

    Camera --> MediaAPI
    AI --> WebGL
    Alerts --> NotifAPI
    Alerts --> AudioAPI

    style Presentation fill:#e3f2fd
    style Logic fill:#f3e5f5
    style Integration fill:#fff3e0
    style Browser fill:#e8f5e9
```

## 9. Alert System Architecture

```mermaid
flowchart TD
    Trigger[Boundary Breach Detected] --> AlertMgr[useAlertManager.triggerAlert]

    AlertMgr --> Check{Check<br/>Cooldown}

    Check -->|Within 5s| Skip[Skip Alert]
    Check -->|Expired| Proceed[Proceed with Alert]

    Proceed --> Update[Update lastAlertTime<br/>in Context]

    Update --> Parallel{Alert Methods}

    Parallel -->|Notifications Enabled| Notif{Permission<br/>Granted?}
    Parallel -->|Audio Configured| Audio{Audio File<br/>Loaded?}

    Notif -->|Yes| ShowNotif[Show Desktop Notification]
    Notif -->|No| LogNotif[Log Warning]

    Audio -->|Yes| PlayAudio[Play Audio Alert]
    Audio -->|No| LogAudio[Skip Audio]

    ShowNotif --> Done[Alert Complete]
    LogNotif --> Done
    PlayAudio --> Done
    LogAudio --> Done
    Skip --> Done

    Done --> Wait[Wait for Next Detection]

    style Trigger fill:#ffcdd2
    style Proceed fill:#fff59d
    style ShowNotif fill:#c8e6c9
    style PlayAudio fill:#c8e6c9
    style Skip fill:#cfd8dc
```

## 10. Error Handling Flow

```mermaid
flowchart TD
    App[Application Start] --> EB[ErrorBoundary Wrapper]

    EB --> Router[Router + Components]

    Router --> Errors{Error<br/>Occurred?}

    Errors -->|Render Error| Catch1[ErrorBoundary Catches]
    Errors -->|Camera Error| Catch2[CameraFeed Error Handler]
    Errors -->|Model Error| Catch3[useObjectDetection Error Handler]
    Errors -->|Alert Error| Catch4[useAlertManager Error Handler]

    Catch1 --> Show1[Show Error UI<br/>with Reload Button]
    Catch2 --> Show2[Show Camera Error Message<br/>• Access Denied<br/>• No Camera Found<br/>• In Use]
    Catch3 --> Show3[Show Model Error<br/>Retry Load Button]
    Catch4 --> Log4[Log Warning<br/>Continue Gracefully]

    Show1 --> User1{User Action}
    Show2 --> User2{User Action}
    Show3 --> User3{User Action}

    User1 -->|Reload| App
    User2 -->|Check Permissions| Router
    User3 -->|Retry| Router

    Log4 --> Continue[Continue Monitoring<br/>with Reduced Functionality]

    style EB fill:#fff59d
    style Catch1 fill:#ffcdd2
    style Catch2 fill:#ffcdd2
    style Catch3 fill:#ffcdd2
    style Continue fill:#c8e6c9
```

## Architecture Highlights

### Key Design Patterns

1. **Context + Reducer Pattern**
   - Centralized state management
   - Predictable state updates via actions
   - Avoids prop drilling

2. **Custom Hooks Pattern**
   - Encapsulates complex logic
   - Reusable and testable
   - Separates concerns (UI vs Logic)

3. **Callback Pattern**
   - Component communication via callbacks
   - Unidirectional data flow
   - Clean component boundaries

4. **Error Boundary Pattern**
   - Graceful error handling
   - Prevents full app crashes
   - User-friendly error messages

### Performance Optimizations

1. **Detection Interval**: 500ms balanced for performance
2. **Lite Model**: lite_mobilenet_v2 for speed
3. **Canvas Sync**: ResizeObserver for efficient rendering
4. **Cooldown**: 5s prevents alert spam
5. **Cleanup**: Proper resource disposal prevents memory leaks

### Privacy & Security

1. **Client-Side Only**: No server processing
2. **Local Inference**: AI runs in browser
3. **No Data Upload**: Video never leaves device
4. **No Tracking**: Zero analytics or cookies
5. **Open Source**: Auditable codebase
