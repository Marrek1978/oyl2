import React, { useEffect, useState, useRef } from 'react'
import { Form, Link, useActionData, useLocation, useNavigation } from '@remix-run/react'

import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons';

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
  const [projectId, setProjectId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [description, setDescription] = useState<string>('')
  const [saveEdits, setSaveEdits] = useState<boolean>(false)
  const [selectedDesireId, setSelectedDesireId] = useState<string>('')
  const [isAddNewProjectRoute, setIsAddNewProjectRoute] = useState<boolean>(true) //true if /dash/desires, false if /dash/desires/:desireId

  let listOfUsedDesireIds = useRef(allUserProjects?.map((project) => project.desireId))

  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    if (location.pathname === '/dash/projects') {
      setIsAddNewProjectRoute(true)
    } else if (location.pathname.startsWith('/dash/projects/')) {
      setIsAddNewProjectRoute(false)
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
    setSaveEdits(
      title !== project?.title
      || description !== project?.description
      || !!(project?.desireId && selectedDesireId !== project?.desireId)   //original desire is changed
      || !!(!project?.desireId && selectedDesireId)  // originally no desire then one is added
    )
  }, [selectedDesireId, title, description, project])


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
      <div className='
          bg-base-100 
          grid grid-cols-[minmax(300px,800px)] grid-rows-[72px_1fr_min-content]
          cursor-default
        '>
        <div className='w-full h-full px-8 bg-base-content flex justify-between items-center'>
          <div className={`
              text-xl font-mont uppercase font-normal tracking-widest 
              text-primary-300
              truncate overflow-ellipsis 
              `}>
            {isAddNewProjectRoute ? 'Create New Project' : (<div ><span className='text-sm' >Edit Project:</span>  {title}</div>)}
          </div>
        </div>

        <Form method='post' className='mx-8'>
          <div className="form-control mt-6">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='projectId' value={projectId} hidden readOnly />
            <label className="label pl-0">
              <span className="label-text text-base font-mont font-semibold">Project Title</span>
            </label>
            <input type="text"
              placeholder="Enter a Project Title"
              name='title'
              className="
                input border-none input-secondary 
                bg-base-200 rounded-none
                font-poppins font-normal tracking-wide
                "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {validationErrors?.title && (
              <div className='text-red-700'> {validationErrors.title}</div>
            )}

            <div className='mt-6'>
              <label className="label pl-0">
                <span className="label-text text-base font-mont font-semibold">Description</span>
              </label>
              <textarea
                className="w-full 
                  textarea textarea-bordered h-24 
                  input border-none input-secondary 
                  bg-base-200 rounded-none
                  font-poppins font-normal  leading-snug
                  "
                placeholder="Describe what you desire. You can describe why you desire somethihng, but do not spend any time justifying your desire."
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              >
              </textarea>
              {validationErrors?.description && (
                <div className='text-red-700'> {validationErrors.description}</div>
              )}
            </div>
          </div>


          {/* //**************Desires CHECKBOXES ***************  */}

          <div className='mt-6'>
            <label className="label pl-0">
              <span className="label-text text-base font-mont font-semibold">Desire Served (Choose one) </span>
            </label>

            <div className="grid grid-cols-[minmax(0,_max-content)_min-content] gap-x-6 ">
              {allUserDesires?.map((desire: Desire) => {
                let isNotAvailabeForAssociation = listOfUsedDesireIds.current?.includes(desire.id)
                return (
                  <React.Fragment key={desire.id}>
                    <div className="mr-12" >
                      <label className={`cursor-pointer label ${isNotAvailabeForAssociation && 'line-through'}`}>
                        <span className="label-text">{desire.title}</span>
                      </label>
                    </div>
                    <div className='label'>
                      {!isNotAvailabeForAssociation && (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-secondary self-center "
                          name='desireId'
                          value={desire.id}
                          checked={selectedDesireId.includes(desire.id)}
                          onChange={() => handleCheckboxChange(desire.id)}
                        />
                      )}
                    </div>
                  </React.Fragment >
                )
              })}
            </div>
          </div>

          {/* //**************BUTTONS ***************  */}
          {isAddNewProjectRoute
            ? (
              <button
                className="w-full btn btn-primary rounded-none mt-8  mb-8   "
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save New Project'} {dbIcon}
              </button>
            ) : (<>

              <div className='mt-6'>
                <button
                  className="btn btn-primary rounded-none w-full   "
                  type='submit'
                  disabled={isSubmitting || !saveEdits}
                >
                  {isSubmitting ? 'Saving...' : 'Save Edits'} {dbIcon}
                </button>
              </div>

              <div className='w-full flex gap-4 mt-6 mb-8'>
                <div className='flex-1'>
                  <Link to='../delete' >
                    <button className='btn btn-error btn-outline  
                    w-full
                    rounded-none
                    font-mont font-semibold
                  ' >
                      Delete Project
                      {trashIcon}
                    </button>
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
            </>)}
        </Form >
      </div >
    </>
  )
}