import type { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

const ExecutiveTemplate = ({ resume }: TemplateProps) => {
  return (
    <div className="bg-white p-10 text-gray-900" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Decorative Top Bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-700 to-purple-700 mb-8"></div>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-5xl font-black tracking-tight mb-2">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-indigo-700 to-purple-700 mb-4"></div>
        <p className="text-2xl font-semibold text-indigo-700 mb-4">
          {resume.personalInfo.title || 'Executive Position'}
        </p>
        {resume.personalInfo.summary && (
          <p className="text-gray-700 leading-relaxed text-lg italic">
            "{resume.personalInfo.summary}"
          </p>
        )}
      </div>

      {/* Contact Bar */}
      <div className="flex gap-6 text-sm text-gray-600 mb-8 pb-6 border-b-2 border-gray-300">
        {resume.personalInfo.email && (
          <span>✉️ {resume.personalInfo.email}</span>
        )}
        {resume.personalInfo.phone && (
          <span>📱 {resume.personalInfo.phone}</span>
        )}
        {resume.personalInfo.location && (
          <span>📍 {resume.personalInfo.location}</span>
        )}
      </div>

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-5 pb-2 border-b-4 border-indigo-700">
            Executive Experience
          </h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mb-6 pl-4 border-l-4 border-purple-500">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-md font-semibold text-indigo-700 mb-3">
                {exp.company}
              </p>
              {exp.location && (
                <p className="text-sm text-gray-600 mb-2">📍 {exp.location}</p>
              )}
              <ul className="text-gray-700 space-y-2">
                {exp.description.map((desc, idx) => (
                  <li key={idx} className="flex">
                    <span className="text-purple-600 mr-3 font-bold">›</span>
                    <span>{desc}</span>
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
          <h2 className="text-2xl font-bold text-indigo-700 mb-5 pb-2 border-b-4 border-indigo-700">
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-4 pl-4 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-gray-900">
                {edu.degree} in {edu.field}
              </h3>
              <p className="text-indigo-700 font-semibold">{edu.institution}</p>
              <div className="text-sm text-gray-600 flex gap-4 mt-1">
                <span>{edu.endDate}</span>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills & Achievements in Two Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Skills */}
        {resume.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-indigo-700 mb-3 pb-2 border-b-2 border-indigo-700">
              Key Skills
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              {resume.skills.map((skillGroup) => (
                <div key={skillGroup.id}>
                  <p className="font-semibold text-gray-800 mb-1">{skillGroup.category}</p>
                  {skillGroup.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center text-xs ml-2">
                      <span className="w-2 h-2 bg-indigo-700 rounded-full mr-2"></span>
                      {skill}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {resume.achievements.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-indigo-700 mb-3 pb-2 border-b-2 border-indigo-700">
              Key Achievements
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              {resume.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start">
                  <span className="text-purple-600 mr-2 font-bold">⭐</span>
                  <span>{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mt-6 pt-6 border-t-2 border-gray-300">
          <h2 className="text-lg font-bold text-indigo-700 mb-3">Professional Certifications</h2>
          <div className="text-sm text-gray-700 space-y-1">
            {resume.certifications.map((cert) => (
              <p key={cert.id}>• {cert.name} – {cert.issuer}</p>
            ))}
          </div>
        </div>
      )}

      {/* Decorative Bottom Bar */}
      <div className="mt-8 h-1 bg-gradient-to-r from-indigo-700 to-purple-700"></div>
    </div>
  );
};

export default ExecutiveTemplate;
