/**
 *
 * copy_task_lettersVsBACS.js
 * William Xiang Quan Ngiam
 * for Briggite Kamleh's Honours (2025)
 *
 * task script for pattern copy task
 * does copy task performance changes for English letters (familiar)
 * compared to BACS characters (unfamiliar)
 *
 * started coding: 3/27/25
 **/

/* Initialize jsPsych */
var jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function () {
        jsPsych.data.get().localSave('csv', 'mydata.csv');
    }
});
timeline = [];

// Set-up DataPipe (in future, auto-upload to OSF)
// const expID = <generated exp code here>

// generate a random subject ID with 10 characters
var subject_id = `${jsPsych.randomization.randomID(10)}`;

// add subject_id to data
jsPsych.data.addProperties({
    subject: subject_id,
});

// DEFINE EXPERIMENT VARIABLES
const n_trials = 60; // Number of trials in the experiment, should be even
const n_items = 6; // Number of items in the copy grid
const n_conditions = 2 // familiar vs unfamiliar
var conditions = ["BACS", "CourierNew"]

// EXPERIMENT STIMULI
// Colours (for practice trial)
const colours = ['colours/blue.png','colours/green.png','colours/red.png','colours/yellow.png']

// Brussels Artificial Character Set (BACS)
const BACS = ['bacs/BACS_B.png', 'bacs/BACS_G.png', 'bacs/BACS_J.png', 'bacs/BACS_K.png', 'bacs/BACS_P.png',
    'bacs/BACS_R.png', 'bacs/BACS_V.png', 'bacs/BACS_X.png'
]

// CourierNew 
const letters = ['courier/CourierNew_B.png', 'courier/CourierNew_G.png', 'courier/CourierNew_J.png', 'courier/CourierNew_K.png',
    'courier/CourierNew_P.png', 'courier/CourierNew_R.png', 'courier/CourierNew_V.png', 'courier/CourierNew_X.png'
]

// BUILD EXPERIMENT VARIABLES
// Set up interleaved trials
shuffled_trial_conditions = jsPsych.randomization.repeat(conditions, n_trials / 2, false)

// BUILD EXPERIMENT
/* force fullscreen */
var enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true
}
timeline.push(enter_fullscreen);

// preload stimuli
const preload = {
    type: jsPsychPreload,
    auto_preload: true,
    images: [colours, BACS, letters],
};
timeline.push(preload)

// resize the screen
var resize = {
    type: jsPsychResize,
    item_width: 3 + 3 / 8,
    item_height: 2 + 1 / 8,
    prompt: "<p>Click and drag the lower right corner of the box until the box is the same size as a credit card held up to the screen.</p>",
    pixels_per_unit: 150
};

timeline.push(resize)

/* define welcome message trial */
/* add consent form here? */
var welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Welcome to the experiment.</p>
    <br>
`,
    choices: [">>"],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline.push(welcome);

/* show task instructions */
var instructions_1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <img src="instructions/show_model_grid.png">
    <p>On each trial, you will start by seeing a model grid on the left. Your task is to recreate this grid on the right.</p>
    <p>When your mouse cursor hovers over the model grid (on the left), the model grid will be visible.</p>
    <p>However, when your mouse cursor moves over to the right, the model grid will no longer be visible.</p>
    <p>You may return and check the model grid as you wish.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline.push(instructions_1);

var instructions_2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <img src="instructions/show_resource_grid.png">
    <p>To recreate the model grid, drag and drop items from the resource pool on the right.</p>
    <p>If you drop the correct item in the correct location, it will lock into place.</p>
    <p>If you drop the wrong item or drop an item in the wrong location, it will wriggle before returning to the pool.</p>
    <p>A trial is completed when the model grid has been successfully recreated.</p>
    <p>There will be one practice trial before you being the experiment.</p>
    <p>Press the button below when you are ready.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline.push(instructions_2);

/* practice trial */
// CREATE GRIDS
// programmatically create a model grid (4 by 4) with 6 items
var practice_rows = 4
var practice_cols = 4
var practice_n_items = 4

// create resource grid and select items
var resource_grid_contents = [[colours[0], colours[1], colours[2], colours[3]]]
var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(colours, practice_n_items)
// select unique (sample WITHOUT replacement) positions in the model grid to place the items in
var selected_model_grid_indices = jsPsych.randomization.sampleWithoutReplacement([...Array((practice_rows * practice_cols)).keys()], practice_n_items)

var model_grid_contents = []

for (var r = 0; r < practice_rows; r++) {
    model_grid_contents[r] = []
    for (var c = 0; c < practice_cols; c++) {
        let index = r * practice_cols + c
        if (selected_model_grid_indices.includes(index)) {
            model_grid_contents[r][c] = selected_model_items.pop()
        } else {
            model_grid_contents[r][c] = null
        }
    }
}

var start_practice = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "",
    choices: ["Start practice trial"],
    button_html: ['<button class="jspsych-btn" style="position:relative; right:325px">%choice%</button>'],
}
timeline.push(start_practice)

var practice_trial = {
    type: jsPsychCopyingTask,
    model_grid_contents: model_grid_contents,
    resource_grid_contents: resource_grid_contents,
    canvas_width: 1300,
    item_file_type: "img",
    prompt: 'Copy the left grid onto the right grid',
}

timeline.push(practice_trial)

/* start experiment instructions */
var start_experiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>You have now completed the practice trial.</p>
    <p>There are 60 trials in total.</p>
    <p>The experiment will begin on the next trial.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>'],
    on_start: function() {
        jsPsych.progressBar.progress = 0
    }
};
timeline.push(start_experiment);

// TRIAL LOOP
for (var t = 0; t < n_trials; t++) {

    // GET TRIAL CONDITION
    this_trial_condition = shuffled_trial_conditions[t]

    // CREATE GRIDS
    // programmatically create a model grid (4 by 4) with 6 items 
    var n_rows = 4
    var n_cols = 4
    var n_model_items = n_items // fixed number of items in each trial for now.

    // CREATE RESOURCE GRID AND SELECT MODEL ITEMS
    if (this_trial_condition === "BACS") {
        // load in BACS characters
        var resource_grid_contents = [
            [BACS[0], BACS[1], BACS[2], BACS[3],],
            [BACS[4], BACS[5], BACS[6], BACS[7],],
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(BACS, n_model_items)

    } else {
        // load in Courier New letters
        var resource_grid_contents = [
            [letters[0], letters[1], letters[2], letters[3],],
            [letters[4], letters[5], letters[6], letters[7],],
        ]

        var selected_model_items = jsPsych.randomization.sampleWithoutReplacement(letters, n_model_items)
    }

    // select unique (sample WITHOUT replacement) positions in the model grid to place the items in
    var selected_model_grid_indices = jsPsych.randomization.sampleWithoutReplacement([...Array((n_rows * n_cols)).keys()], n_model_items)

    var model_grid_contents = []

    for (var r = 0; r < n_rows; r++) {
        model_grid_contents[r] = []
        for (var c = 0; c < n_cols; c++) {
            let index = r * n_cols + c
            if (selected_model_grid_indices.includes(index)) {
                model_grid_contents[r][c] = selected_model_items.pop()
            } else {
                model_grid_contents[r][c] = null
            }
        }
    }

    var button_start = {
        type: jsPsychHtmlButtonResponse,
        stimulus: "",
        choices: ["Start trial"],
        button_html: ['<button class="jspsych-btn" style="position:relative; right:325px">%choice%</button>'],
    }
    timeline.push(button_start)

    var copy_task = {
        type: jsPsychCopyingTask,
        model_grid_contents: model_grid_contents,
        resource_grid_contents: resource_grid_contents,
        canvas_width: 1300,
        item_file_type: "img",
        prompt: 'Copy the left grid onto the right grid',
        on_finish: function() {
            var curr_progress_bar_value = jsPsych.progressBar.progress;
            jsPsych.progressBar.progress = curr_progress_bar_value + (1/n_trials);
        }
    }

    timeline.push(copy_task)

}

var strategy_survey = {
    type: jsPsychSurveyText,
    questions: [
        {prompt: 'You have completed all the trials. Did you use any strategies to complete the task? If so, please provide a brief explanation of your strategy.'}
    ]
}

timeline.push(strategy_survey)
/* upload data */
//var save_data = {
//    type: jsPsychPipe,
//    action: "save",
//    experiment_id: expID,
//    filename: fileID + `.csv`,
//    wait_message: "<p>Saving data. Please do not close this page.</p>",
//    data_string: ()=>jsPsych.data.get().csv()
//};
//
//timeline.push(save_data)

/* end of experiment */
var end_experiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>This is the end of the experiment. Thank you for participating!</p>',
    choices: ["FINISH"],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
}

timeline.push(end_experiment)

var close_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false
}

timeline.push(close_fullscreen)

// Run the Task
jsPsych.run(timeline)

