import { parse } from 'querystring'
import { Link, Outlet, useLoaderData } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import TextBtn from '~/components/buttons/TextBtn'
import FormButtons from '~/components/forms/FormButtons'
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG'
import DndMilestones from '~/components/dnds/milestones/DndMilestones'
import { getMilestoneGroupAndItsMilesonesById } from '~/models/milestoneGroup.server'
import { updateMilestoneCompleted, updateMilestonesOrder } from '~/models/milestone.server'
import { transformMilestoneGroupDataDates } from '~/components/utilities/helperFunctions'

import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';

export const loader = async ({ request, params }: LoaderArgs) => {
  const groupId = params.milestoneGroupId;
  if (!groupId) throw new Error('No milestoneGroupId was provided')
  try {
    const milestoneGroupWithMilestones = await getMilestoneGroupAndItsMilesonesById(groupId);
    return milestoneGroupWithMilestones
  } catch (error) { throw error }
}


export const action = async ({ request, params }: ActionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const submitedString = parsedBody.toServerDataString
    const actionType = JSON.parse(submitedString as string).actionType

    if (actionType === 'complete') {
      const milestone = JSON.parse(parsedBody.toServerDataString as string).milestone
      try {
        await updateMilestoneCompleted(milestone)
        return 'success'
      } catch (error) { return 'failed' }
    }

    if (actionType === 'editSortOrder') {
      const milestones = JSON.parse(parsedBody.toServerDataString as string).sortableArray
      try {
        await updateMilestonesOrder(milestones)
        return 'success'
      } catch (error) { return 'failed' }
    }
  }
  return null
}


function MilestoneGroupPage() {

  const loaderData = useLoaderData();
  const { milestones: loadedMilestones, ...loadedGroup } = loaderData;

  const milestoneGroup = transformMilestoneGroupDataDates(loadedGroup)
  const header = (<> <span className='text-sm mr-1' >Milestone Group:</span> {milestoneGroup.title}  </>)

  return (
    <>
      <Outlet />
      <Modal >
        <div className={`w-[1200px] min-w-[250px] felx-1`}>

          {/* //!  make component */}

          <BasicFormAreaBG
            h2Text={header}
            maxWidth='1200px'
            linkDestination='edit'
            linkText='Edit'
            btnColorDaisyUI='link'
            linkColorDaisyUI='info'
          >
            <div className='m-8 flex flex-col gap-8'>

              {milestoneGroup?.description && (
                <div>
                  <p>
                    {milestoneGroup?.description}
                  </p>
                </div>
              )}

              <DndMilestones />

              <div className='w-full flex justify-center'>
                <Link to='newMilestone '>
                  <TextBtn text='Add Milestone' />
                </Link>
              </div>

              <FormButtons
                saveBtnTxt={'Save Milestones Order'}
                isSaveable={false}
                hideSaveBtn={true}
                showCloseBtn={true}
                closeBtnText='Close'
              />
            </div>
          </BasicFormAreaBG >
        </div>
      </Modal >
    </>
  )
}

export default MilestoneGroupPage


// export const useGetAllMilestonesForGroup = (): MilestoneGroupsWithMilestones | undefined => {

//   const navigate = useNavigate();
//   const loaderData = useLoaderData();
//   const { milestones: loadedMilestones, ...loadedGroup } = loaderData;
//   console.log('loadedGroup', loadedGroup)
//   console.log('loadedMilestones', loadedMilestones)
//   const [milestones, setMilestones] = useState<Milestone[]>([]);
//   const [milestoneGroup, setMilestoneGroup] = useState<MilestoneGroup>();

//   useEffect(() => {
//     if (!loadedGroup) return
//     const groupDatekeys = ['createdAt', 'updatedAt'];
//     const groupWithProperDates = ObjectStrToDates({item:loadedGroup, dateKeys:groupDatekeys})
//     console.log('groupWithProperDates', groupWithProperDates)
//     const groupWithStrDatesIntoArray: MilestoneGroupsWithStrDates[] = [groupWithStrDates];
//     const milestoneGroupWithProperDates = ArrayOfObjectsStrToDates({ items: groupWithStrDatesIntoArray, dateKeys: groupDatekeys });
//     setMilestoneGroup(milestoneGroupWithProperDates[0]);

//     console.log('milestoneGroupWithProperDates from helper', typeof milestoneGroupWithProperDates[0].createdAt)

//     if (milestonesWithStrDates) {
//       const milestonesDatekeys = ['createdAt', 'updatedAt', 'dueDate', 'completedAt'];
//       const milestonesWithProperDates: Milestone[] = ArrayOfObjectsStrToDates({ items: milestonesWithStrDates, dateKeys: milestonesDatekeys });
//       setMilestones(milestonesWithProperDates);
//     }
//   }, [loaderData, navigate]);

//   if (milestoneGroup) {
//     return {
//       ...milestoneGroup,
//       milestones,
//     };
//   }
//   return undefined;
// }




