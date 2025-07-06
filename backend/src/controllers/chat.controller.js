import { generateStreamToken } from '../utils/stream.js';


export const getstreamToken = (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);
    
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}