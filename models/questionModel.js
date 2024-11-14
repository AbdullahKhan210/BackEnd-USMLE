const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: [true, "A Question must have a questionId!"],
    },
    text: {
      type: String,
      required: [true, "A Question must have a text!"],
    },
    imgs: [
      {
        type: String,
      },
    ],
    multipleChoice: [
      {
        option: {
          optionText: {
            type: String,
            required: true,
          },
          optionImg: {
            type: String,
          },
          optionLabel: {
            type: String,
            required: [true, "A Question must have a optionLabel!"],
            enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
          },
        },
        correctOption: {
          type: Boolean,
          default: false,
        },
      },
    ],
    explanation: {
      textExplanation: {
        type: String,
      },
      imgExplanation: {
        type: String,
      },
    },
    subject: {
      type: String,
      required: [true, "A Question must have a subject!"],
    },
    system: {
      type: String,
      required: [true, "A Question must have a system!"],
    },
    topic: {
      type: String,
      required: [true, "A Question must have a topic!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
