import { AppError } from "../Utils/appError.js";
import workModel from "../Models/workModel.js";
import userModel from "../Models/userModel.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";

export const addWork = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    domain,
    skillsRequired,
    budget,
    deadline,
    owner,
  } = req.body;

  if (
    !title ||
    !description ||
    !domain ||
    !skillsRequired ||
    !budget ||
    !deadline ||
    !owner
  ) {
    return next(new AppError("Enter all details", 400));
  }

  const work = await workModel.create({
    title,
    description,
    domain,
    skillsRequired,
    budget,
    deadline,
    owner,
  });

  res.status(201).json({
    status: "success",
    data: {
      work,
    },
  });
});

export const getWorks = asyncHandler(async (req, res, next) => {
  const works = await workModel.find();

  res.status(200).json({
    status: "success",
    total: works.length,
    data: {
      works,
    },
  });
});

export const getWorksByOwner = asyncHandler(async (req, res, next) => {
  const ownerId = req.params.id;

  const works = await workModel.find({ owner: ownerId });

  res.status(200).json({
    status: "success",
    total: works.length,
    data: {
      works,
    },
  });
});

export const getWorkById = asyncHandler(async (req, res, next) => {
  const workId = req.params.id;

  const work = await workModel.findById(workId);

  if (!work) {
    return next(new AppError("There no work with this id", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      work,
    },
  });
});

export const deleteWork = asyncHandler(async (req, res, next) => {
  const workId = req.params.id;

  const work = await workModel.findById(workId);

  //it check, id format is correct but there is no work with this id in db.. Note : Global error handler check form id format if id is not
  // in correct format then it will throug an error i.e Cast Error
  if (!work) {
    return next(new AppError("Not fount work with this id", 400));
  }

  await work.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const updateWorkStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const workId = req.params.id;

  const work = await workModel.findById(workId);

  if (!work) {
    return next(new AppError("Work not found with this id", 400));
  }

  if (!status) {
    return next(new AppError("Please select/enter status of work", 400));
  }

  const newData = {
    status,
  };

  const updatedWork = await workModel.findByIdAndUpdate(workId, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      updatedWork,
    },
  });
});

export const applyForWork = asyncHandler(async (req, res, next) => {
  const { freelancerId } = req.body;
  const work = await workModel.findById(req.params.id);
  const freelancer = await userModel.findById(freelancerId);

  if (!freelancer) {
    return next(new AppError("No freelancer found with this id", 400));
  }

  if (!work) {
    return next(new AppError("Work not found with this id", 400));
  }

  work.applications.push({ freelancers: freelancerId });
  await work.save();

  res.status(200).json({
    status: "success",
    data: {
      work,
    },
  });
});

export const acceptApplycation = asyncHandler(async (req, res, next) => {
  const { freelancerId } = req.body;
  const workId = req.params.id;

  const work = await workModel.findById(workId);
  if (!work) {
    return next(new AppError("Work not found with this id", 400));
  }

  const freelancer = await userModel.findById(freelancerId);
  if (!freelancer) {
    return next(new AppError("No freelancer found with this id", 400));
  }

  if (work.status !== "open") {
    return next(new AppError("This work is not open", 400));
  }

  const application = work.applications.find(
    (a) => a.freelancers.toString() === freelancerId
  );

  if (!application) {
    return next(
      new AppError("This freelancer has not applied for this work", 400)
    );
  }

  application.status = "accepted";

  work.applications.forEach((a) => {
    if (a.freelancers.toString() !== freelancerId) {
      a.status = "rejected";
    }
  });

  work.status = "in progress";

  await work.save();

  res.status(200).json({
    work,
  });
});

export const closeWork = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const workId = req.params.id;

  const work = await workModel.findById(workId);

  if (!work) {
    return next(new AppError("Work not found with this id", 400));
  }

  if (work.status === "completed" || work.status === "cancelleds") {
    return next(new AppError("Work is already closed", 400));
  }

  let newStatus = "";

  if (status === "in progress") {
    newStatus = "completed";
  } else if (status === "open") {
    newStatus = "cancelleds";
  }

  work.status = newStatus;

  await work.save();

  res.status(200).json({
    status: "success",
    data: {
      work,
    },
  });
});
