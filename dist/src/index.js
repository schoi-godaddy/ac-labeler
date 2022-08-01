"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labelName = core_1.default.getInput("label");
        console.log(labelName);
        const time = new Date().toTimeString();
        core_1.default.setOutput("time", time);
        if (!process.env.GITHUB_TOKEN) {
            throw new Error("GITHUB_TOKEN environment variable not found.");
        }
        const client = github_1.default.getOctokit(process.env.GITHUB_TOKEN);
        const contextPullRequest = github_1.default.context.payload.pull_request;
        if (!contextPullRequest) {
            throw new Error("This action can only be invoked in `pull_request_target` or `pull_request` events.");
        }
        const owner = contextPullRequest.base.user.login;
        const repo = contextPullRequest.base.repo.name;
        console.log(contextPullRequest);
    }
    catch (error) {
        core_1.default.setFailed(error.message);
    }
});
exports.default = run;
