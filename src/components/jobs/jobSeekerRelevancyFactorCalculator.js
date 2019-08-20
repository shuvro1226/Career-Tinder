import {
  RelevancyFactors,
  RelevancyConfig
} from "../../constants/relevancyFactors";
const boyerMoore = require("../../store/actions/Boyer-Moore").boyerMooreSearch;

const addScoreToJobSeeker = (jobposting, jobseekers) => {
  jobseekers.forEach(seeker => {
    let score = 0;
    let skillMatch = false;
    let minsalary = Number(seeker.minsalary) ? Number(seeker.minsalary) : 0;

    if (RelevancyConfig.SKILL_IS_ACTIVE) {
      if (
        jobposting.neededskills &&
        jobposting.neededskills.length &&
        seeker.skills &&
        seeker.skills.length
      ) {
        seeker.skills.forEach(userSkill => {
          jobposting.neededskills.forEach(jobSkill => {
            if (
              boyerMoore(
                jobSkill.label.toLowerCase(),
                userSkill.label.toLowerCase()
              ) // string pattern matching using Boyer–Moore string-search algorithm
            ) {
              score += RelevancyFactors.EACH_SKILL_MATCH_FACTOR;
              skillMatch = true;
            }
          });
        });
      }
      if (skillMatch) score += RelevancyFactors.SKILL;
    }
    if (RelevancyConfig.LANGUAGE_IS_ACTIVE) {
      let languageMatch = false;
      if (
        jobposting.languages &&
        jobposting.languages.length &&
        seeker.languages &&
        seeker.languages.length
      ) {
        seeker.languages.forEach(userLanguage => {
          jobposting.languages.forEach(language => {
            if (
              userLanguage.label.toLowerCase() === language.label.toLowerCase()
            ) {
              score += RelevancyFactors.EACH_LANGUAGE_MATCH_FACTOR;
              languageMatch = true;
            }
          });
        });
      }
      if (languageMatch) score += RelevancyFactors.LANGUAGE;
    }
    if (
      RelevancyConfig.LOCATION_IS_ACTIVE &&
      jobposting.location &&
      jobposting.location.length &&
      seeker.city
    ) {
      jobposting.location.forEach(site => {
        if (site.label.toLowerCase() === seeker.city.label.toLowerCase()) {
          score += RelevancyFactors.LOCATION;
        }
      });
    }
    if (RelevancyConfig.JOBTYPE_IS_ACTIVE) {
      if (
        jobposting.applyfulltime === seeker.applyfulltime ||
        jobposting.applypartime === seeker.applypartime
      ) {
        score += RelevancyFactors.JOBTYPE;
      }
    }
    if (
      RelevancyConfig.SALARY_IS_ACTIVE &&
      Number(jobposting.maxsalary) &&
      Number(jobposting.maxsalary) >= minsalary
    ) {
      score += RelevancyFactors.SALARY;
    }
    if (
      RelevancyConfig.EDUCATION_IS_ACTIVE &&
      jobposting.education &&
      seeker.education
    ) {
      if (
        jobposting.education.label &&
        seeker.education.label &&
        jobposting.education.label.toLowerCase() ===
          seeker.education.label.toLowerCase()
      ) {
        score += RelevancyFactors.EDUCATION;
      }
    }

    seeker.relevancyScore = score;
  });
};

export default addScoreToJobSeeker;
