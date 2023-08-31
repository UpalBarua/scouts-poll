import { useEffect, useMemo, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import PoleOption from './pole-option';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';
import Button from '../ui/button';
import useUser from '../../hooks/use-user';
import ResultChart from '../../chart/ResultChart';

const PoleCard = ({ _id, options, title, description }) => {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const prevVotedOption = options.find((option) =>
      option.votes.includes(user._id)
    )?._id;

    setSelectedOption(prevVotedOption);
  }, [options, user, setSelectedOption]);


  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!selectedOption) {
        return toast.error('No option selected');
      }

      if (!user._id) {
        return toast.error('Something went wrong');
      }

      await axios.patch(`/pole/${_id}`, {
        userId: user?._id,
        optionId: selectedOption,
      })
        .then(response => {
          if (response.status === 200) {
            setSubmitted(true)
          }
        })
      console.log(submitted)

      toast.success('Vote submitted');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteAgain = () => {
    setSubmitted(false)
  }

  return (
    <div className="flex flex-col w-full max-w-full p-4 space-y-2 rounded-lg shadow sm:p-6 bg-primary-900">
      {
        submitted ? (
          <ResultChart voter={user} poleId={_id} handleVoteAgain={handleVoteAgain} />
        ) :
          (
            <div><h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
              {title}
            </h3>
              <p className="pb-3">{description}</p>
              <RadioGroup
                value={selectedOption}
                onChange={setSelectedOption}
                className="space-y-3">
                {options?.map((option) => (
                  <PoleOption key={option._id} {...option} />
                ))}
              </RadioGroup>
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button variant="secondary">Change Vote</Button>
                <Button
                  variant="primary"
                  disabled={isSubmitting}
                  onClick={handleSubmit}>
                  {isSubmitting ? (
                    <>
                      <CgSpinner className="text-xl animate-spin" />
                      <span>Submitting</span>
                    </>
                  ) : (
                    <span>Submit Vote</span>
                  )}
                </Button>
              </div>
            </div>
          )
      }
    </div>
  );
};

export default PoleCard;
