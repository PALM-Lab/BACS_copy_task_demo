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
var jsPsych = initJsPsych({});
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
const n_trials = 10; // Number of trials in the experiment, should be even
const n_items = 4; // Number of items in the copy grid
const n_conditions = 2 // familiar vs unfamiliar
var conditions = ["BACS","CourierNew"]

// EXPERIMENT STIMULI
// Brussels Artificial Character Set (BACS)
const BACS = ['bacs/BACS_B.png', 'bacs/BACS_G.png', '/bacs/BACS_J.png', 'bacs/BACS_K.png', 'bacs/BACS_P.png',
    'bacs/BACS_R.png', 'bacs/BACS_V.png', 'bacs/BACS_X.png'
]

// CourierNew 
const letters = ['courier/CourierNew_B.png', 'courier/CourierNew_G.png', 'courier/CourierNew_J.png', 'courier/CourierNew_K.png',
    '/courier/CourierNew_P.png', 'courier/CourierNew_R.png', 'courier/CourierNew_V.png', 'courier/CourierNew_X.png'
]

// BUILD EXPERIMENT VARIABLES
// Can choose alternating trials, shuffled trials or blocked trials
shuffled_trial_conditions = jsPsych.randomization.repeat(conditions,n_trials/2,false)

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
    images: [BACS, letters],
    max_load_
};
timeline.push(preload)

// resize the screen
var resize = {
    type: jsPsychResize,
    item_width: 3 + 3/8,
    item_height: 2 + 1/8,
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

/* define instructions trial */
var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>Instructions go here.</p>
    <p>Press the button below when you are ready.</p>
`,
    choices: ['>>'],
    button_html: ['<button class="jspsych-btn">%choice%</button>']
};
timeline.push(instructions);

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
    }

    timeline.push(copy_task)

}

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

