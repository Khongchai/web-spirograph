use core::panic;

use std::f64::consts::PI;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calc_lines(
    points: usize,
    mut theta: f64,
    step: f64,
    data: JsValue,
    rod_length: f64,
) -> Vec<f64> {
    let mut arr: Vec<f64> = Vec::with_capacity(points * 4 - 4);
    let mut first_time = true;
    let mut prev_point: [f64; 2] = [0.0, 0.0];
    let mut new_point: [f64; 2] = [0.0, 0.0];

    let parsed_data: Vec<[f64; 4]> = serde_wasm_bindgen::from_value(data).unwrap();

    let parsed_data_len = parsed_data.len();
    if parsed_data_len < 2 {
        panic!("Provide at least 2 cycloids");
    }

    let parsed_data_crunched: Vec<[f64; 3]> = parsed_data
        .iter()
        .map(|a| [a[0] + a[1], PI * 0.5 * a[2], a[3]])
        .collect();

    let parsed_data_crunched_ptr: *const [f64; 3] = parsed_data_crunched.as_ptr();

    for _ in 0..points {
        compute_epitrochoid(
            parsed_data_crunched_ptr,
            parsed_data_len,
            theta,
            rod_length,
            &mut new_point,
        );

        if first_time {
            first_time = false;
        } else {
            arr.extend_from_slice(&[prev_point[0], prev_point[1], new_point[0], new_point[1]]);
        }

        prev_point = new_point;

        theta += step;
    }

    arr
}

pub fn compute_epitrochoid(
    data: *const [f64; 3],
    data_len: usize,
    theta: f64,
    rod_length: f64,
    new_point: &mut [f64; 2],
) {
    *new_point = [0.0, 0.0];
    unsafe {
        for i in 0..data_len {
            let d = *data.add(i);
            new_point[0] += d[0] * (theta * d[2] - d[1]).cos();
            new_point[1] += d[0] * (theta * d[2] + d[1]).sin();
        }

        new_point[0] += rod_length * theta.cos();
        new_point[1] += rod_length * theta.sin();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::{Map, Value};
    use std::fs;

    #[test]
    fn compute_epitrochoid_test() {
        let data: String =
            fs::read_to_string("test_data.json").expect("Unable to read the test json file");
        let values: Value =
            serde_json::from_str(&data).expect("Unable to parse json into rust value");

        for value in values.as_array().unwrap() {
            let args: &Map<String, Value> = value["args"].as_object().unwrap();
            let theta: f64 = args["theta"].as_f64().unwrap();
            let rod_length: f64 = args["rodLength"].as_f64().unwrap();

            let data: Vec<Vec<f64>> = args["data"]
                .as_array()
                .unwrap()
                .iter()
                .map(|e| {
                    e.as_array()
                        .unwrap()
                        .iter()
                        .map(|e| e.as_f64().unwrap())
                        .collect::<Vec<f64>>()
                })
                .collect::<Vec<Vec<f64>>>();

            let computation_result = compute_epitrochoid(&data, theta, rod_length);
            let expected = value["result"].as_object().unwrap();

            println!("computation result: {:?}", computation_result);
            println!("expected: {:?}", expected);

            let bound = 0.0000001;

            assert_within_bound(
                computation_result[0],
                expected["x"].as_f64().unwrap(),
                bound,
            );

            assert_within_bound(
                computation_result[1],
                expected["y"].as_f64().unwrap(),
                bound,
            );
        }

        /// Assert that a given set of numbers's difference is no larger than some value.
        fn assert_within_bound(n1: f64, n2: f64, bound: f64) {
            return assert!((n1 - n2).abs() < bound);
        }
    }
}
