import { Contest } from "../model/Contest.js";
import { QuestionModel } from "../model/Question.js";
import { User } from "../model/User.js";

// Create a new contest
export const createContest = async (req, res) => {
  try {
    const { title, description, startDate, endDate, isPublic} = req.body;
    const userId = req.id; 
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    // Check if the user is an admin
    if (!findUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
   findUser.count -= 1; // Increment the count
    await findUser.save(); // Save the updated user document
    if (findUser.count < 0) {
      return res.status(400).json({ 
        success: false, 
        message: "You do not have enough contests left to create a new contest" 
      });
    }
    const newContest = new Contest({
      creator: userId, // Set the creator to the logged-in user
      title,
      description: description || "",
      startDate: startDate || new Date(),
      endDate: endDate || undefined, // Will use the default function from schema
      isPublic: isPublic !== undefined ? isPublic : true,
      QuestionSet: []
    });

    await newContest.save();

    return res.status(201).json({ 
      success: true,
      message: "Contest created successfully", 
      contest: newContest 
    });
  } catch (error) {
    console.error("Error in createContest controller:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Add question to a contest
export const addQuestion = async (req, res) => {
  try {
     console.log("body",req.body);
    const { Question, Options, Answer, contestId } = req.body;

    if (!Question || !Options || !Answer || !contestId) {
      return res.status(400).json({ 
        success: false,
        message: "Question, options, answer, and contestId are required" 
      });
    }

    // Find the contest first to ensure it exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ 
        success: false,
        message: "Contest not found" 
      });
    }

    // Create a new question
    const newQuestion = new QuestionModel({
      Question,
      Options,
      Answer
    });

    await newQuestion.save();

    // Add question to contest
    contest.QuestionSet.push(newQuestion._id);
    await contest.save();

    return res.status(201).json({ 
      success: true,
      message: "Question added successfully",
      question: newQuestion
    });
  } catch (error) {
    console.error("Error in addQuestion controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};


// Get all contests of user
export const getallcontestofuser = async (req, res) => {
  const userid=req.id
  // console.log(userid)
  try {
    const contests = await Contest.find({creator:userid})
      .sort({ createdAt: -1 })
      // .populate('QuestionSet')
      .select('-__v'); 
    
    if (contests.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "No contests found",
        contests: [] 
      });
    }

    return res.status(200).json({ 
      success: true,
      count: contests.length,
      contests 
    });
  } catch (error) {
    console.error("Error in getAllContests controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};
// // Get all contests (for admin)
export const getallcontest = async (req, res) => {
  try {
    const contests = await Contest.find()
      .sort({ createdAt: -1 })
      .populate('QuestionSet') // Populate questions
      .select('-__v'); // Exclude version key

    if (contests.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "No contests found",
        contests: [] 
      });
    }

    return res.status(200).json({ 
      success: true,
      count: contests.length,
      contests 
    });
  } catch (error) {
    console.error("Error in getAllContests controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get a single contest by ID
export const getContestById = async (req, res) => {
  try {
    
    const { id:contestId } = req.params;
    console.log("hi",contestId);
    
    const contest = await Contest.findById(contestId)
      .populate('QuestionSet') // Populate questions
      .select('-__v');
    
    if (!contest) {
      return res.status(404).json({ 
        success: false,
        message: "Contest not found" 
      });
    }

    return res.status(200).json({ 
      success: true,
      contest 
    });
  } catch (error) {
    console.error("Error in getContestById controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update a contest
export const updateContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { title, description, startDate, endDate, isPublic } = req.body;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ 
        success: false,
        message: "Contest not found" 
      });
    }

    // Update fields if provided
    if (title) contest.title = title;
    if (description !== undefined) contest.description = description;
    if (startDate) contest.startDate = startDate;
    if (endDate) contest.endDate = endDate;
    if (isPublic !== undefined) contest.isPublic = isPublic;

    await contest.save();

    return res.status(200).json({ 
      success: true,
      message: "Contest updated successfully",
      contest 
    });
  } catch (error) {
    console.error("Error in updateContest controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete a contest
export const deleteContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ 
        success: false,
        message: "Contest not found" 
      });
    }

    

    await Contest.findByIdAndDelete(contestId);

    return res.status(200).json({ 
      success: true,
      message: "Contest deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deleteContest controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Remove a question from a contest
export const removeQuestionFromContest = async (req, res) => {
  try {
    const { contestId, questionId } = req.params;
    
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ 
        success: false,
        message: "Contest not found" 
      });
    }

    // Check if question exists in the contest
    const questionIndex = contest.QuestionSet.indexOf(questionId);
    if (questionIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: "Question not found in this contest" 
      });
    }

    // Remove question from contest
    contest.QuestionSet.splice(questionIndex, 1);
    await contest.save();

   

    return res.status(200).json({ 
      success: true,
      message: "Question removed from contest successfully" 
    });
  } catch (error) {
    console.error("Error in removeQuestionFromContest controller:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get all public contests (for users to participate)

export const makePublic = async (req, res) => {
    try {
        const { contestId, isPublic } = req.body;
        
       
        const contest = await Contest.findById(contestId);
        console.log(contest);
        
       
        if (!contest) {
            return res.status(404).json({ 
                success: false, 
                message: "Contest not found" 
            });
        }
        
      
        contest.isPublic = isPublic;
        
        
        await contest.save();
        
        return res.status(200).json({ 
            success: true,
            message: "Contest visibility updated successfully",
            contest: {
                id: contest._id,
                title: contest.title,
                isPublic: contest.isPublic
            }
        });
        
    } catch (error) {
        console.log("error in makePublic", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};