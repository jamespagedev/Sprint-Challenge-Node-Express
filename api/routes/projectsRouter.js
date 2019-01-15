/***************************************************************************************************
 ******************************************* dependencies ******************************************
 **************************************************************************************************/
const express = require('express');
const db = require('../../data/helpers/projectModel.js');
const projectValidation = require('../../middleware/projectValidation.js');
const router = express.Router();

/***************************************************************************************************
 ******************************************** middleware *******************************************
 **************************************************************************************************/
// None

/***************************************************************************************************
 ********************************************** routes *********************************************
 **************************************************************************************************/
// /api/projects
router.get('/', (req, res) => {
  db.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// /api/projects/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get(id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err =>
      res.status(500).json({ message: `Project with id ${id} not found` })
    );
});

// /api/projects/:id/actions
router.get('/:id/actions', (req, res) => {
  const id = req.params.id;

  db.getProjectActions(id)
    .then(project => {
      if (project.length === 0) {
        res.status(404).json({ message: `Project with id ${id} not found` });
      } else {
        res.status(200).json(project);
      }
    })
    .catch(err => res.status(500).json({ message: err }));
});

// /api/projects
router.post('/', projectValidation, (req, res) => {
  let newProject;
  if (req.body.hasOwnProperty('completed')) {
    const { name, description, completed } = req.body;
    newProject = { name, description, completed };
  } else {
    const { name, description } = req.body;
    newProject = { name, description };
  }
  db.insert(newProject)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// /api/projects/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get(id)
    .then(project => {
      if (project) {
        db.remove(id).then(count => {
          res.status(202).json(project);
        });
      } else {
        res.status(404).json({
          message: `The project with the specific ID '${id}' does not exist`
        });
      }
    })
    .catch(err =>
      res.status(500).json({
        error: `The project with the specific ID '${id}' does not exist`
      })
    );
});

// /api/projects/:id
router.put('/:id', projectValidation, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  db.get(id)
    .then(project => {
      if (project) {
        db.update(id, changes)
          .then(result => res.status(200).json(result))
          .catch(err => res.status(500).json({ error: err }));
      } else {
        res.status(404).json({
          error: `The project with the specific ID '${id}' does not exist`
        });
      }
    })
    .catch(err =>
      res.status(500).json({
        error: `The project with the specific ID '${id}' does not exist`
      })
    );
});

/***************************************************************************************************
 ********************************************* export(s) *******************************************
 **************************************************************************************************/
module.exports = router;
