'use client'

import { useState } from 'react'
import type { AboutData } from '@/lib/about'
import Image from 'next/image'
import DetailModal from './DetailModal'

interface AboutSectionProps {
  data: AboutData
  detailContents: Record<string, string>
}

export default function AboutSection({ data, detailContents }: AboutSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')

  const handleProjectClick = (project: typeof data.projects[0]) => {
    if (project.detailFile && detailContents[project.detailFile]) {
      setModalTitle(project.name)
      setModalContent(detailContents[project.detailFile])
      setModalOpen(true)
    }
  }

  const handleActivityClick = (activity: typeof data.activities[0]) => {
    if (activity.detailFile && detailContents[activity.detailFile]) {
      setModalTitle(activity.title)
      setModalContent(detailContents[activity.detailFile])
      setModalOpen(true)
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            {data.profile.image && (
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {data.profile.image ? (
                    <Image
                      src={data.profile.image}
                      alt={data.profile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    data.profile.name.charAt(0)
                  )}
                </div>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.profile.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{data.profile.title}</p>
              <p className="text-gray-700 mb-4">{data.profile.description}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {data.profile.github && (
                  <a
                    href={data.profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {data.profile.linkedin && (
                  <a
                    href={data.profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {data.profile.email && (
                  <a
                    href={`mailto:${data.profile.email}`}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-500">{exp.period}</span>
                  </div>
                  <p className="text-primary-600 font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-700 mb-3">{exp.description}</p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow ${
                    project.detailFile ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => project.detailFile && handleProjectClick(project)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    {project.featured && (
                      <span className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{project.period}</p>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        GitHub →
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Demo →
                      </a>
                    )}
                    {project.detailFile && (
                      <span className="text-sm text-primary-600">상세 보기 →</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activities Section */}
        {data.activities.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Activity</h2>
            <div className="space-y-6">
              {data.activities.map((activity, index) => (
                <div
                  key={index}
                  className={`border-l-4 border-primary-500 pl-6 p-2 -ml-2 rounded ${
                    activity.detailFile ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
                  }`}
                  onClick={() => activity.detailFile && handleActivityClick(activity)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
                    <span className="text-sm text-gray-500">{activity.period}</span>
                  </div>
                  <p className="text-primary-600 font-medium mb-2">
                    {activity.organization}
                    {activity.role && ` • ${activity.role}`}
                  </p>
                  <p className="text-gray-700">{activity.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards Section */}
        {data.awards.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Award</h2>
            <div className="space-y-4">
              {data.awards.map((award, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 text-xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{award.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {award.organization} • {award.date}
                    </p>
                    <p className="text-gray-700 text-sm">{award.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {data.certifications.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Certification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{cert.issuer}</p>
                  <p className="text-xs text-gray-500 mb-2">{cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-xs text-gray-500 mb-2">ID: {cert.credentialId}</p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      자격증 확인 →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
    </>
  )
}
