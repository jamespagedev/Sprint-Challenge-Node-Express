/***************************************************************************************************
 ******************************************* dependencies ******************************************
 **************************************************************************************************/
const express = require('express');
const db = require('../../data/helpers/actionModel.js');
const actionValidation = require('../../middleware/actionValidation.js');
const router = express.Router();

/***************************************************************************************************
 ******************************************** middleware *******************************************
 **************************************************************************************************/
// None

/***************************************************************************************************
 ********************************************** routes *********************************************
 **************************************************************************************************/
// /api/actions
router.get('/', (req, res) => {
  db.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// /api/actions/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get(id)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err =>
      res.status(500).json({ message: `Action with id ${id} not found` })
    );
});

// /api/actions
router.post('/', actionValidation, (req, res, next) => {
  let newAction;

  if (req.body.hasOwnProperty('completed')) {
    const { project_id, description, notes, completed } = req.body;
    newAction = { project_id, description, notes, completed };
  } else {
    const { project_id, description, notes } = req.body;
    newAction = { project_id, description, notes };
  }

  db.insert(newAction)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// /api/users/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get(id)
    .then(action => {
      if (action) {
        db.remove(id).then(count => {
          res.status(202).json(action);
        });
      } else {
        res.status(404).json({
          message: `The action with the specific ID '${id}' does not exist`
        });
      }
    })
    .catch(err =>
      res.status(500).json({
        error: `The action with the specific ID '${id}' does not exist`
      })
    );
});

// /api/users/:id
router.put('/:id', actionValidation, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  db.get(id)
    .then(action => {
      if (action) {
        db.update(id, changes)
          .then(result => res.status(200).json(result))
          .catch(err => res.status(500).json({ error: err }));
      } else {
        res.status(404).json({
          error: `The action with the specific ID '${id}' does not exist`
        });
      }
    })
    .catch(err =>
      res.status(500).json({
        error: `The action with the specific ID '${id}' does not exist`
      })
    );
});

/***************************************************************************************************
 ********************************************* export(s) *******************************************
 **************************************************************************************************/
module.exports = router;
