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
    // owner,
  } = req.body;
  const user = req.user;
  const owner = user._id.toString();

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

  user.currentWork.push(work._id);
  await user.save();

  res.status(201).json({
    status: "success",
    data: {
      work,
    },
  });
});

export const getWorks = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["sort", "limit", "page", "fields"];

  //only filter is apply here we need to done sorting and limiting saparetly

  excludedFields.forEach((ele) => delete queryObj[ele]);

  const works = await workModel.find(queryObj);

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
  const userId = req.user._id;
  const owner = req.user;

  const work = await workModel.findById(workId);

  //it check, id format is correct but there is no work with this id in db.. Note : Global error handler check form id format if id is not
  // in correct format then it will throug an error i.e Cast Error
  if (!work) {
    return next(new AppError("Not fount work with this id", 400));
  }

  if (!userId.equals(work.owner)) {
    return next(
      new AppError("Only the work owner can perform this action", 400)
    );
  }

  //removing id from client work history
  if (work.status === "in progress" || work.status === "open") {
    owner.currentWork = owner.currentWork.filter(
      (id) => id.toString() !== workId.toString()
    );
  } else {
    owner.workHistory = owner.workHistory.filter(
      (id) => id.toString() !== workId.toString()
    );
  }

  await owner.save();

  //removing id from freelancer work history '

  if (work.status === "in progress" || work.status === "completed") {
    let freelancerId;

    for (let freelancer of work.applications) {
      if (freelancer.status === "accepted") {
        freelancerId = freelancer.freelancers;
        break;
      }
    }

    if (freelancerId) {
      const freelancer = await userModel.findById(freelancerId);

      if (work.status === "in progress") {
        freelancer.currentWork = freelancer.currentWork.filter(
          (id) => id.toString() !== workId.toString()
        );
      } else if (work.status === "completed") {
        freelancer.workHistory = freelancer.workHistory.filter(
          (id) => id.toString() !== workId.toString()
        );
      }

      await freelancer.save();
    }
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
  const freelancerId = req.user._id.toString();

  const work = await workModel.findById(req.params.id);
  const freelancer = await userModel.findById(freelancerId);

  if (!freelancer) {
    return next(new AppError("No freelancer found with this id", 400));
  }

  if (!work) {
    return next(new AppError("Work not found with this id", 400));
  }

  const alreadyApplied = work.applications.some((a) =>
    a.freelancers.equals(freelancerId)
  );

  if (alreadyApplied) {
    return next(
      new AppError(
        "You’ve already applied. Please wait for a response from the client.",
        400
      )
    );
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

  freelancer.currentWork.push(work._id);
  await freelancer.save();

  res.status(200).json({
    work,
  });
});

export const closeWork = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const workId = req.params.id;
  const owner = req.user;

  const work = await workModel.findById(workId);

  if (!work) {
    return next(new AppError("Work not found with this id", 400));
  }

  if (!owner._id.equals(work.owner)) {
    return next(
      new AppError("Only the work owner can perform this action", 400)
    );
  }
  if (work.status === "completed" || work.status === "cancelled") {
    return next(new AppError("Work is already closed", 400));
  }

  let newStatus = "";

  if (status === "in progress") {
    newStatus = "completed";
  } else if (status === "open") {
    newStatus = "cancelled";
  }

  work.status = newStatus;

  await work.save();

  owner.currentWork = owner.currentWork.filter(
    (id) => id.toString() !== workId.toString()
  );

  if (!owner.workHistory.some((id) => id.toString() === workId.toString())) {
    owner.workHistory.push(workId);
  }

  await owner.save();

  if (newStatus === "completed") {
    let freelancerId;

    for (let a of work.applications) {
      if (a.status === "accepted") {
        freelancerId = a.freelancers;
        break;
      }
    }

    if (freelancerId) {
      const freelancer = await userModel.findById(freelancerId);
      if (freelancer) {
        freelancer.currentWork = freelancer.currentWork.filter(
          (id) => id.toString() !== workId.toString()
        );
        // Add to workHistory if not already added
        if (
          !freelancer.workHistory.some(
            (id) => id.toString() === workId.toString()
          )
        ) {
          freelancer.workHistory.push(workId);
        }

        await freelancer.save();
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      work,
    },
  });
});

export const searchWork = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  const works = await workModel.find({
    $and: [
      { status: "open" },
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { domain: { $regex: query, $options: "i" } },
        ],
      },
    ],
  });

  res.status(200).json({
    status: "success",
    total: works.length,
    data: {
      works,
    },
  });
});
