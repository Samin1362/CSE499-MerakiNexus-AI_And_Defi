import torch
from torchvision import transforms
from PIL import Image
import sys
import json

# Check if an image path is provided
if len(sys.argv) < 2:
    print("Error: Please provide an image path as a command-line argument.")
    sys.exit(1)  # Exit the script if no image path is provided

# Get the image path from the command-line argument
image_path = sys.argv[1]

# Load the TorchScript model explicitly on the CPU
model_path = '/Users/md.saminisrak/Desktop/Express/MerakiNexus-Subject-0/backend/merakiNexus_models/aesthetic_model.pth'  # Replace with your model path
model = torch.jit.load(model_path, map_location=torch.device('cpu'))
model.eval()  # Set the model to evaluation mode

# Define the transformation for image preprocessing
transform = transforms.Compose([
    transforms.Resize(224),  # Resize the image to 224x224
    transforms.ToTensor(),   # Convert the image to a tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize
])

# Preprocess the image: Resize, Normalize, and Convert to Tensor
def preprocess_image(image_path):
    image = Image.open(image_path).convert("RGB")  # Open and convert image to RGB mode
    image_tensor = transform(image).unsqueeze(0)  # Add batch dimension
    return image_tensor

# Run inference using the scripted model
def run_inference(image_path):
    # Preprocess the image
    image_tensor = preprocess_image(image_path)
    
    # Run inference
    with torch.no_grad():
        output = model(image_tensor)  # Pass image through the model
        
        # Assuming the model outputs a tensor with 4 values (one for each category)
        balance, color_harmony, depth_perspective, texture_brushwork = output

        # Convert logits to probabilities and scale to percentage
        scores = {
            "Balance": torch.sigmoid(balance).item() * 100,
            "Color Harmony": torch.sigmoid(color_harmony).item() * 100,
            "Depth & Perspective": torch.sigmoid(depth_perspective).item() * 100,
            "Texture & Brushwork": torch.sigmoid(texture_brushwork).item() * 100
        }

        # Calculate the weighted aesthetic score
        weights = {
            "Balance": 0.3,
            "Color Harmony": 0.3,
            "Depth & Perspective": 0.2,
            "Texture & Brushwork": 0.2
        }

        # Weighted score calculation
        weighted_score = sum(scores[key] * weights[key] for key in scores)

    return scores, weighted_score

# Run the inference
scores, weighted_score = run_inference(image_path)

# Prepare the result
result = {
    "scores": scores,
    "weightedScore": weighted_score
}

# Return the result as JSON
print(json.dumps(result, indent=4))


# python -u "/Users/md.saminisrak/Desktop/Express/MerakiNexus-Subject-0/backend/controllers/aesthetic_infer_model.py" "/Users/md.saminisrak/Desktop/9.png"
