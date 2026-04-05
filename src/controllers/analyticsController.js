import { getSummaryService } from "../services/analyticsService.js";

export const getSummaryController = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const response = await getSummaryService(req.user.id);

    return res.status(response.success ? 200 : 500).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getSummaryController",
      error: error.message,
    });
  }
};
