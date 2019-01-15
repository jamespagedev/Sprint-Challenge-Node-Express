module.exports = (req, res, next) => {
  const project = req.body;
  let completedPropValid = true;

  if (project.hasOwnProperty('completed')) {
    if (typeof project.completed !== 'boolean') {
      completedPropValid = false;
      res
        .status(400)
        .json({ message: "Project property 'completed' must be a boolean" });
    }
  }

  if (!project.hasOwnProperty('name')) {
    res.status(400).json({ message: "Project missing 'name' property" });
  } else if (!project.hasOwnProperty('description')) {
    res.status(400).json({ message: "Project missing 'description' property" });
  } else if (typeof project.name !== 'string') {
    res
      .status(400)
      .json({ message: "Project property 'name' must be a string" });
  } else if (typeof project.description !== 'string') {
    res
      .status(400)
      .json({ message: "Project property 'description' must be a string" });
  } else if (!project.name) {
    res.status(400).json({ message: 'Please provide a name for the project' });
  } else if (project.name.length > 128) {
    res
      .status(400)
      .json({ message: 'Name is too long. Use up to  128 characters' });
  } else if (!project.description) {
    res
      .status(400)
      .json({ message: 'Please provide a description for the project' });
  } else if (completedPropValid) {
    next();
  }
};
