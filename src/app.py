from flask import Flask, Response
import cv2
from cameralive import yolo_process  # ส่วนประมวลผลที่คุณมีอยู่

app = Flask(__name__)

@app.route('/video_feed')
def video_feed():
    return Response(yolo_process(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)
