import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import ConfirmationModal from '../ui/confirmation-modal';
import { successToast, errorToast } from '../../utilities/toast';

const PollMenu = ({ pollId, isActive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (pollId) => {
    try {
      await axios.delete(`/polls/${pollId}`);
      window.location.reload();
      successToast('Poll deleted');
    } catch (error) {
      console.error(error);
      errorToast('Something went wrong');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <Menu as="div" className="inline-block relative text-left">
      <Menu.Button className="text-2xl p-1.5 rounded-md hover:bg-primary-800 hover:text-white">
        <BsThreeDotsVertical />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="flex absolute right-0 flex-col px-2 py-2 mt-1 w-40 rounded-md shadow-lg origin-top-right bg-primary-800 focus:outline-none">
          <Menu.Item
            as={'button'}
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 rounded-md hover:bg-primary-700 hover:text-white text-start">
            Delete Poll
          </Menu.Item>
          {isActive ? (
            <Menu.Item
              as={Link}
              to={`/edit-poll/${pollId}`}
              className="px-3 py-2 rounded-md hover:bg-primary-700 hover:text-white">
              Edit Poll
            </Menu.Item>
          ) : null}
        </Menu.Items>
      </Transition>
      <ConfirmationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={'Delete Poll?'}
        description={
          'This poll will be permanently removed, and it cannot be recovered'
        }
        onConfirm={() => handleDelete(pollId)}
      />
    </Menu>
  );
};
export default PollMenu;
