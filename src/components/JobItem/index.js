import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import {Link} from 'react-router-dom'

import './index.css'

const JobItem = props => {
  const {jobItem} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobItem
  return (
    <Link to={`/jobs/${id}`} className="link-style">
      <li className="jobitem-container">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="rating-title-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-package-container">
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
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
