var express = require('express');
var router = express.Router();
var common = require('../common');
const { v4: uuidv4 } = require('uuid');
var Exercise = require('../../modules/Exercise');


router.post('/', async function (req, res) {
        const newVideo= new Exercise({
            ExerciseId :uuidv4(),
            Category :req.body.category,
            Video : req.body.url
        });
        await Exercise.createExercise(newVideo, function (err, exercise) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, {
                    ExerciseId: exercise.ExerciseId
                });
        });
    // });
});

router.delete('/removeExercise/:ExerciseId', async function (req, res) {
        await Exercise.removeExercise(req.params.ExerciseId, async function (err, exerciseNoy) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, {
                    exerciseId: exerciseNoy.ExerciseId
                });
        });
    // });
});

module.exports = router;