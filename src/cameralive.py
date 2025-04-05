import cv2
import pandas as pd
import numpy as np
from ultralytics import YOLO

# โหลดโมเดล YOLO
model = YOLO('yolov8s.pt')

# เปิดกล้องจาก RTSP
# rtsp_url = "rtsp://Sopon219:sopon219@192.168.1.140:554/stream1"
# rtsp://username:password@192.168.1.140:554/stream1
rtsp_url = "rtsp://sopon1684:Hirun8922@192.168.1.140:554/stream1"
cap = cv2.VideoCapture(rtsp_url)

# โหลด class labels
with open("coco.txt", "r") as my_file:
    class_list = my_file.read().split("\n")

# ตำแหน่งพื้นที่จอดรถ (แก้ตามตำแหน่งจริงได้)
area1 = [(290, 280), (20, 340), (220, 350), (400, 280)]
area2 = [(440, 280), (210, 370), (380, 390), (620, 280)]
area3 = [(630, 280), (380, 400), (640, 430), (750, 285)]
area4 = [(750, 290), (640, 440), (970, 480), (900, 295)]

# ฟังก์ชันวาดกรอบพื้นที่
def draw_area(frame, area, count, label):
    color = (0, 0, 255) if count == 1 else (0, 255, 0)
    cv2.polylines(frame, [np.array(area, np.int32)], True, color, 2)
    cv2.putText(frame, label, (area[0][0], area[0][1] - 10),
                cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

# ฟังก์ชันหลักสำหรับ streaming
def yolo_process():
    frame_id = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        frame = cv2.resize(frame, (1020, 500))

        if frame_id % 20 == 0:
            results = model.predict(frame, verbose=False, agnostic_nms=True, max_det=5)
        frame_id += 1

        px = pd.DataFrame(results[0].boxes.data).astype("float")
        list1, list2, list3, list4 = [], [], [], []

        for _, row in px.iterrows():
            x1, y1, x2, y2, _, d = row
            x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
            c = class_list[int(d)]

            if 'car' in c:
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2

                if cv2.pointPolygonTest(np.array(area1, np.int32), (cx, cy), False) >= 0:
                    list1.append(c)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)

                if cv2.pointPolygonTest(np.array(area2, np.int32), (cx, cy), False) >= 0:
                    list2.append(c)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)

                if cv2.pointPolygonTest(np.array(area3, np.int32), (cx, cy), False) >= 0:
                    list3.append(c)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)

                if cv2.pointPolygonTest(np.array(area4, np.int32), (cx, cy), False) >= 0:
                    list4.append(c)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)

        a1, a2, a3, a4 = len(list1), len(list2), len(list3), len(list4)
        occupied = a1 + a2 + a3 + a4
        space = 4 - occupied

        draw_area(frame, area1, a1, "1")
        draw_area(frame, area2, a2, "2")
        draw_area(frame, area3, a3, "3")
        draw_area(frame, area4, a4, "4")

        # แสดงจำนวนช่องว่าง มุมขวาบน
        text = f"Car Remaining: {space}"
        (text_width, text_height), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_PLAIN, 2, 2)
        x = frame.shape[1] - text_width - 10
        y = 30
        cv2.putText(frame, text, (x, y), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)

        # แปลงเป็น MJPEG frame สำหรับ frontend
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
