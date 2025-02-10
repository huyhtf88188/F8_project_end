export const validateIdMongo = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id && mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "id không đúng định dạng" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
