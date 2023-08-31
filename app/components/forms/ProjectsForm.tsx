import React, { useEffect, useState, useRef } from 'react'
import { Form, Link, useActionData, useLocation, useNavigation } from '@remix-run/react'

import ListLabel from './ListLabel';
import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { DesireTitle, DesireValuesServed } from '../utilities/Guidelines';

import type { Desire, Project } from '@prisma/client'

interface ProjectFormProps {
  project?: Project;
  desire?: Desire;
  allUserDesires: Desire[];
  allUserProjects: Project[];
}

export default function ProjectsForm({ project, desire, allUserDesires, allUserProjects }: ProjectFormProps) {

  const location = useLocation()
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [projectId, setProjectId] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [selectedDesireId, setSelectedDesireId] = useState<string>('')
  const [saveBtnText, setSaveBtnText] = useState<string>('Save Project')
  const [isNew, setIsNew] = useState<boolean>(true) //true if /dash/desires, false if /dash/desires/:desireId

  let listOfUsedDesireIds = useRef(allUserProjects?.map((project) => project.desireId))

  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    if (location.pathname === '/dash/projects') {
      setIsNew(true)
      setSaveBtnText('Create Project')
    } else if (location.pathname.startsWith('/dash/projects/')) {
      setIsNew(false)
      setSaveBtnText('Save Edits to Project')
    }
  }, [location.pathname]);


  //loading data from passedProject or nothing
  useEffect(() => {
    setTitle(project?.title || '')
    setDescription(project?.description || '')
    setSortOrder(project?.sortOrder || allUserProjects?.length || 1)
    setProjectId(project?.id || '')
    setSelectedDesireId(project?.desireId || '')
    listOfUsedDesireIds.current = listOfUsedDesireIds.current?.filter((desireId) => desireId !== project?.desireId)
  }, [allUserProjects, project])


  useEffect(() => {
    const isInputEmpty = !title
    const isInputDifferent =
      title !== project?.title
      || !!(project?.desireId && selectedDesireId !== project?.desireId)   //original desire is changed
      || !!(!project?.desireId && selectedDesireId)  // originally no desire then one is added
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [selectedDesireId, title, description, project, isNew, isSubmitting])


  const handleCheckboxChange = (desireId: string) => {
    setSelectedDesireId((prevId) => {
      if (prevId === desireId) {
        return ''
      } else {
        return desireId
      }
    })
  }


  return (
    <>
      <BasicFormAreaBG
        title={isNew
          ? 'Create New Project'
          : (
            <>
              <div >
                <span className='text-sm' >
                  Edit Project:
                </span>
              </div>
              <div>
                {title}
              </div>
            </>
          )
        }
      >

        <Form method='post' className='mx-8'>
          <div className="form-control mt-6">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='projectId' value={projectId} hidden readOnly />

            <InputLabelWithGuideLineLink
              text='Project'
              guideline={DesireTitle}
              title='Project Title'
            />
            <input type="text"
              placeholder="Enter a Project Title"
              name='title'
              className='input-field-text-title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {validationErrors?.title && (
              <div className='text-red-700'> {validationErrors.title}</div>
            )}
            {validationErrors?.description && (
              <div className='text-red-700'> {validationErrors.description}</div>
            )}
          </div>


          {/* //**************Desires CHECKBOXES ***************  */}

          <div className='vert-space-between-inputs'>
            <InputLabelWithGuideLineLink
              text='Desire Served : Required (Choose One)'
              guideline={DesireValuesServed}
              title='Desire Served'
            />

            <div className="list-grid ">
              {allUserDesires?.map((desire: Desire) => {
                let isNotAvailabeForAssociation = listOfUsedDesireIds.current?.includes(desire.id)
                return (
                  <React.Fragment key={desire.id}>
                    <div className={` ${isNotAvailabeForAssociation && 'line-through'}`} >
                      <ListLabel text={desire.title} />
                    </div>
                    <div className='label'>
                      {!isNotAvailabeForAssociation && (
                        <input
                          type="radio"
                          className="checkbox checkbox-secondary self-center "
                          name='desireId'
                          value={desire.id}
                          checked={selectedDesireId?.includes(desire.id)}
                          onChange={() => handleCheckboxChange(desire.id)}
                          required
                        />
                      )}
                    </div>
                  </React.Fragment >
                )
              })}
              {validationErrors?.description && (
                <div className='text-red-700'> {validationErrors.desireList}</div>
              )}
            </div>
          </div>

          {/* //**************BUTTONS ***************  */}
          <div className='mt-6 mb-8'>
            <SolidBtn text={isSubmitting ? 'Saving...' : saveBtnText}
              onClickFunction={() => { }}
              icon={dbIcon}
              disableBtn={isSubmitting || !isSaveable}
            />

            {!isNew && (
              <div className='w-full flex gap-4 mt-6 mb-8'>
                <div className='flex-1'>
                  <Link to='delete' >
                    <OutlinedBtn
                      text='Delete Desire'
                      onClickFunction={() => { }}
                      icon={trashIcon}
                      daisyUIBtnColor='error'
                    />
                  </Link>
                </div>

                <div className='flex-1'>
                  <Link to='..' >
                    <SolidBtnGreyBlue text='Close w/o saving'
                      onClickFunction={() => { }}
                      icon={closeIcon}
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Form >
      </BasicFormAreaBG>
    </>
  )
}
