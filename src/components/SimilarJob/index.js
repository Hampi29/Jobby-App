import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJob = props => {
  const {similarjobdetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarjobdetails
  return (
    <li className="similar-job-container">
      <div className="similar-job-header-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1 className="title-job-heading">{title}</h1>
          <div className="rating-container">
            <BsStarFill className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <div className="loc-type-container">
        <div className="icon-item ">
          <MdLocationOn className="icons" />
          <p>{location}</p>
        </div>
        <div className="icon-item ">
          <BsBriefcaseFill className="icons" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarJob
