#!/usr/bin/env node
'use strict';

var inquirer = require('inquirer');
var bench = require('./lib/bench');

function select(callback) {
    inquirer
        .prompt([
            {
                type: 'checkbox',
                message: 'Select packages',
                name: 'list',
                choices: [
                    new inquirer.Separator(' = The usual ='),
                    {
                        name: 'response-json',
                        checked: true
                    },
                    {
                        name: 'response-text',
                        checked: true
                    }
                ],
                validate: function validate(answer) {
                    if (answer.length < 1) {
                        return 'You must choose at least one package.';
                    }
                    return true;
                }
            }
        ])
        .then(function onPrompted(answers) {
            callback(answers.list);
        });
}

inquirer
    .prompt([
        {
            type: 'confirm',
            name: 'compare',
            message: 'Do you want to compare HEAD with latest release?',
            default: true
        },
        {
            type: 'confirm',
            name: 'all',
            message: 'Do you want to run all benchmark tests?',
            default: true
        },
        {
            type: 'input',
            name: 'connection',
            message: 'How many connection you need?',
            default: 100,
            validate: function validate(value) {
                return (
                    !Number.isNaN(parseFloat(value)) || 'Please enter a number'
                );
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'pipelining',
            message: 'How many pipelining you need?',
            default: 10,
            validate: function validate(value) {
                return (
                    !Number.isNaN(parseFloat(value)) || 'Please enter a number'
                );
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'duration',
            message: 'How long does it takes?',
            default: 30,
            validate: function validate(value) {
                return (
                    !Number.isNaN(parseFloat(value)) || 'Please enter a number'
                );
            },
            filter: Number
        }
    ])
    .then(function validate(opts) {
        if (!opts.all) {
            select(function onSelected(list) {
                bench(opts, list);
            });
        } else {
            bench(opts, ['response-json', 'response-text']);
        }
    });
