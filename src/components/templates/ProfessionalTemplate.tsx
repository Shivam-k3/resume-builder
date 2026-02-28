import type { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

const ProfessionalTemplate = ({ resume }: TemplateProps) => {
  return (
    <div className="bg-white p-10 text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="mb-8 pb-6 border-b-4 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-800 mb-1">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg font-semibold text-gray-700 uppercase tracking-wide mb-3">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex gap-4 text-sm text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>•</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>•</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
        {resume.personalInfo.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed text-justify">
            {resume.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-400">
            Professional Experience
          </h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-gray-800">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {exp.company} | {exp.location}
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                {exp.description.map((desc, idx) => (
                  <li key={idx} className="list-disc">
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-400">
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-gray-800">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs text-gray-600">{edu.endDate}</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {edu.institution}
                {edu.gpa && ` | GPA: ${edu.gpa}`}
              </p>
              {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-gray-400">
            Core Competencies
          </h2>
          <div className="space-y-3">
            {resume.skills.map((skillGroup) => (
              <div key={skillGroup.id}>
                <p className="text-sm font-semibold text-gray-800 mb-1">{skillGroup.category}</p>
                <div className="grid grid-cols-2 gap-2">
                  {skillGroup.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <span className="mr-2 text-gray-800">▪</span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(resume.certifications.length > 0 || resume.achievements.length > 0) && (
        <div>
          {resume.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-gray-400">
                Certifications
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {resume.certifications.map((cert) => (
                  <p key={cert.id}>• {cert.name} – {cert.issuer}</p>
                ))}
              </div>
            </div>
          )}

          {resume.achievements.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-gray-400">
                Achievements
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {resume.achievements.map((achievement) => (
                  <p key={achievement.id}>• {achievement.title}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
