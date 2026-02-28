import type { Resume } from '../../types/resume';

interface TemplateProps {
  resume: Resume;
}

const TechFocusTemplate = ({ resume }: TemplateProps) => {
  return (
    <div className="bg-slate-900 text-white p-8" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Left Sidebar */}
      <div className="grid grid-cols-4 gap-6 h-full">
        {/* Left Column - Contact & Skills */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-lg">
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
              Contact
            </h3>
            <div className="text-xs text-slate-300 space-y-2">
              {resume.personalInfo.email && <p>{resume.personalInfo.email}</p>}
              {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
              {resume.personalInfo.location && <p>{resume.personalInfo.location}</p>}
            </div>
          </div>

          {resume.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
                Skills
              </h3>
              <div className="text-xs text-slate-300 space-y-2">
                {resume.skills.map((skillGroup) => (
                  <div key={skillGroup.id}>
                    <p className="text-cyan-300 font-semibold text-xs mb-1">{skillGroup.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {skillGroup.skills.map((skill, idx) => (
                        <div key={idx} className="bg-slate-700 px-2 py-1 rounded text-cyan-300 text-xs">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.certifications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
                Certifications
              </h3>
              <div className="text-xs text-slate-300 space-y-1">
                {resume.certifications.map((cert) => (
                  <p key={cert.id}>{cert.name}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-3">
          {/* Personal Info Header */}
          <div className="mb-6 pb-6 border-b-2 border-cyan-400">
            <h1 className="text-4xl font-black text-white mb-1">
              {resume.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-lg text-cyan-400 font-semibold">
              {resume.personalInfo.title || 'Tech Professional'}
            </p>
            {resume.personalInfo.summary && (
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {resume.personalInfo.summary}
              </p>
            )}
          </div>

          {/* Experience */}
          {resume.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-cyan-400 uppercase mb-4">Experience</h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-white">{exp.position}</h3>
                    <span className="text-xs text-slate-400">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-cyan-300 text-sm">{exp.company}</p>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1 ml-4">
                    {exp.description.map((desc, idx) => (
                      <li key={idx} className="list-disc">{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-cyan-400 uppercase mb-4">Projects</h2>
              {resume.projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h3 className="font-semibold text-white">{project.name}</h3>
                  <p className="text-sm text-slate-300">{project.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-cyan-400 uppercase mb-4">Education</h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-white">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-xs text-slate-400">{edu.endDate}</span>
                  </div>
                  <p className="text-cyan-300 text-sm">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechFocusTemplate;
