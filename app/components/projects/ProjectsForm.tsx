import type { Desire, Project } from '@prisma/client'
import { Form, Link, useActionData, useLocation, useMatches, useNavigation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import type { ProjectWithDesires } from '~/types/projectTypes';

interface ProjectFormProps {
  passedProject?: ProjectWithDesires
}

export default function ProjectsForm({ passedProject }: ProjectFormProps) {

  const matches = useMatches();
  const location = useLocation()
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const project = passedProject as ProjectWithDesires

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [projectId, setProjectId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [isAddNewProjectRoute, setIsAddNewProjectRoute] = useState<boolean>(true) //true if /dash/desires, false if /dash/desires/:desireId
  // const [projectDesire, setProjectDesire] = useState<Desire[]>([])
  const [checkedValue, setCheckedValue] = useState<string>('');

  const isSubmitting = navigation.state === 'submitting'
  const allUserProjects: Project[] = matches.find(match => match.id === 'routes/dash.projects')?.data.projects
  const listOfDesireIdsInProjectsTable: string[] = allUserProjects?.filter((project) => project.desireId !== null)  // list of projects that have a desireId
    .map((project) => project.desireId as string)
  console.log('listOfDesireIdsInProjectsTable', listOfDesireIdsInProjectsTable)

  const allUserDesires: Desire[] = matches.find(match => match.id === 'routes/dash.projects')?.data.desires


  useEffect(() => {
    if (location.pathname === '/dash/projects') {
      setIsAddNewProjectRoute(true)
    } else if (location.pathname.startsWith('/dash/projects/')) {
      setIsAddNewProjectRoute(false)
    }
  }, [location.pathname]);


  useEffect(() => {
    setTitle(project?.title || '')
    setDescription(project?.description || '')
    setSortOrder(project?.sortOrder || allUserProjects?.length || 0)
    setProjectId(project?.id || '')

    if (project?.desireId) {
      setCheckedValue(project.desireId)
      // setProjectDesires(project.desires.map(d => d.desire))
    }
  }, [allUserProjects, project])

  // useEffect(() => {
  // if (projectDesires) {
  //   setCheckedValue(projectDesires?.map(projectDesire => projectDesire?.title));
  // }
  // }, [projectDesire]);

  // const handleCheckboxChange = (valueTitle: string) => {
  //   setCheckedValue(prevCheckedValue => {
  //     if (prevCheckedValue.includes(valueTitle)) {
  //       return prevCheckedValue.filter(title => title !== valueTitle);
  //     } else {
  //       return [valueTitle]; // instead of spreading the previous values, replace all of them with the new value
  //     }
  //   });
  // }

  const handleRadioChange = (desireId: string) => {
    setCheckedValue(desireId);
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
                let isNotAvailabeForAssociation = listOfDesireIdsInProjectsTable.map((desireId) => desireId === desire.id).includes(true)

                // desire.projectId ? true : false
                console.log('isNotAvailabeForAssociation  is', isNotAvailabeForAssociation)


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
                          type="radio"
                          className="radio radio-secondary self-center "
                          name='desireId'
                          value={desire.id}
                          checked={checkedValue === desire.id}
                          onChange={() => handleRadioChange(desire.id)}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Edits'} {dbIcon}
                </button>
              </div>

              <div className='w-full flex gap-4 mt-6 mb-8'>
                <div className='flex-1'>
                  <Link to='delete' >
                    <button className='btn btn-error btn-outline  
                    w-full
                    rounded-none
                    font-mont font-semibold
                  ' >
                      Delete Desire
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
