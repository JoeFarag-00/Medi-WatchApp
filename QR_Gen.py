import qrcode
import cv2
from PIL import Image, ImageDraw, ImageFont

patient_info = """
Patient: Mina Samir
DOB: 16/1/2003
Age: 20
Gender: Male
Nationality: Egyptian
Complication: Flesh Wound
Priority Care: Moderate
Medical Description: Patient is in stable condition.
"""

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(patient_info)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")

draw = ImageDraw.Draw(img)
width, height = img.size
font = ImageFont.load_default()

for i in range(0, width, 20):
    draw.line([(i, 0), (i, height)], fill="black", width=2)

img.save("PatientSeeApp/QR Codes/QR2.png")
img.show()
