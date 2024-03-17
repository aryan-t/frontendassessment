import React, {useEffect, useState } from 'react';
import './EventApi.css';
const BASE_URL = 'https://frontendassessment.arlo.co/api/2012-02-01/pub/resources';

function ApiArlo() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvent] = useState({
    Count: 0,
    Items: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formattedStartDate = (StartDateTime) => new Date(StartDateTime).toLocaleString(
    undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  useEffect (() => {

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/eventsearch`);
        // console.log(response);

        if(!response.ok) {
          throw new Error('Network response error');
        }

        const eventData = await response.json();
        setEvent(eventData);
        // console.log(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.Items.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if(isLoading) {
    return (
      <div className='loading'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='eventcontainer'>
      <div className='page-title'>Upcoming events list</div>
      <div className='events-count'>{events.Count} events found</div>
      <div className='eventslist'>
        {currentItems.length > 0 ? (
            currentItems.map((event) => (
                <div key={event.EventID} className='event-item'>
                  <h2 className='event-title'><a href={event.ViewUri}>{event.Name}</a></h2>
                  <div className='event-data event-date'>{formattedStartDate(event.StartDateTime)}</div>
                  <div className='event-action'>
                    {event.RegistrationIsOpen ? (
                      <a href={event.ViewUri} className='btn-register'>Register</a>
                    ) : (
                      <p className='registration-message'>Registration closed</p>
                    )}
                  </div>
                </div>
              )
            )
        ) : (
          <p>No events available.</p>
        )}
      </div>

      <div className='pagination'>
      {Array.from({ length: Math.ceil(events.Items.length / itemsPerPage) }, (_, index) => index + 1).map(
          (number) => (
            <span key={number} className={currentPage === number ? 'active' : ''} onClick={() => paginate(number)}>
              {number}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default ApiArlo;