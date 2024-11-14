const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testId: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: [true, "A Question must have a subject!"],
    },
    system: {
      type: String,
      required: [true, "A Question must have a system!"],
    },
    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        attempted: {
          type: Boolean,
          default: false,
        },
        optionLabelSelected: {
          type: String,
          required: function () {
            return this.attempted;
          },
          enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        },
        marked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: String,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
