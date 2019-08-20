import {
  RelevancyFactors,
  RelevancyConfig
} from "../../constants/relevancyFactors";
const boyerMoore = require("../../store/actions/Boyer-Moore").boyerMooreSearch;

const addScoreToJobPost = (jobseeker, jobposting) => {
  jobposting.forEach(job => {
    let score = 0;
    let skillMatch = false;
    let minsalary = Number(job.minsalary) ? Number(job.minsalary) : 0;

    if (
      RelevancyConfig.TIME_IS_ACTIVE &&
      job.expirationdate &&
      job.expirationdate.seconds > Math.round(+new Date() / 1000)
    ) {
      score += RelevancyFactors.TIME;
    }

    if (RelevancyConfig.SKILL_IS_ACTIVE) {
      if (
        job.neededskills &&
        job.neededskills.length &&
        jobseeker.skills &&
        jobseeker.skills.length
      ) {
        job.neededskills.forEach(skill => {
          jobseeker.skills.forEach(userSkill => {
            if (
              boyerMoore(
                skill.label.toLowerCase(),
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
        job.languages &&
        job.languages.length &&
        jobseeker.languages &&
        jobseeker.languages.length
      ) {
        job.languages.forEach(language => {
          jobseeker.languages.forEach(userLanguage => {
            if (
              language.label.toLowerCase() === userLanguage.label.toLowerCase()
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
      job.location &&
      job.location.length &&
      jobseeker.city
    ) {
      job.location.forEach(site => {
        if (site.label.toLowerCase() === jobseeker.city.label.toLowerCase()) {
          score += RelevancyFactors.LOCATION;
        }
      });
    }

    if (RelevancyConfig.JOBTYPE_IS_ACTIVE) {
      if (
        job.applyfulltime === jobseeker.applyfulltime ||
        job.applypartime === jobseeker.applypartime
      )
        score += RelevancyFactors.JOBTYPE;
    }

    if (
      RelevancyConfig.SALARY_IS_ACTIVE &&
      Number(jobseeker.minsalary) &&
      minsalary >= Number(jobseeker.minsalary)
    ) {
      score += RelevancyFactors.SALARY;
    }

    if (
      RelevancyConfig.EDUCATION_IS_ACTIVE &&
      job.education &&
      jobseeker.education
    ) {
      if (
        job.education.label.toLowerCase() ===
        jobseeker.education.label.toLowerCase()
      ) {
        score += RelevancyFactors.EDUCATION;
      }
    }

    job.relevancyScore = score;
  });
};

export default addScoreToJobPost;
