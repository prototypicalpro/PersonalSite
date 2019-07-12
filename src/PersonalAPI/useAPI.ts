import Secrets from "./secrets.json";
import * as React from "react";

/**
 * Simple hook to create an effect that fetches data from my API.
 * Source code for my API can be found here: https://github.com/prototypicalpro/LambdaWorkspace/tree/master/PersonalSite
 */

/** interface specifying repository information, to be used below */
interface IGithubRepoInfo {
    /** the name of the repository */
    name: string;
    /** the # of commits that I've made to this repository */
    commitsByMe: number;
    /** whether or not I own this repository */
    ownedByMe: boolean;
    /** estimated hours I've spend writing code in this repository (integer) */
    estimatedHoursByMe: number;
}

/** interface specifying the returned object by the githubcount API */
export interface IGithubRet {
    /** the list of repositories I've contributed to */
    repositories: IGithubRepoInfo[];
    /** total commits just for fun */
    totalCommitsByMe: number;
    /** total hours spent programming for less fun */
    totalHoursByMe: number;
}

 const API_URL = "https://api.prototypical.pro/";

 /**
  * Collect data on my git commit history, courtesy of AWS lambda.
  * @param endpoint URI collect data from (e.x. "/githubcount")
  * @param callback A callback to call when the data is collected
  */
 export const useAPI = (endpoint: string, callback: (data: IGithubRet | null) => void) => {
    React.useEffect(() => {
        fetch(API_URL + endpoint, {
            headers: {
                "x-api-key": Secrets.apiKey,
            },
            // TODO: uncomment when domain is setup
            // mode: "same-origin",
        })
        .then((res) => {
            if (res.status === 200) return res.json();
            else throw Error(`Bad status code from API: ${res.status}`);
        })
        .then(callback)
        .catch((err) => {
            console.error(`Error during API fetch to "${endpoint}":`);
            console.error(err);
            callback(null);
        });
    }, [endpoint, callback]);
 };