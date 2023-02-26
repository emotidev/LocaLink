'use client'

import { Culture } from '@prisma/client'
import fetcher from 'lib/fetcher'
import * as React from 'react'
import useSwr from 'swr'

export default function CreateProfile() {
  const cultures = useSwr('/api/culture', fetcher)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (
      formData.get('culture') === 'null' &&
      formData.get('cultureName') === ''
    ) {
      return alert('Please select a culture or enter a new culture name.')
    }

    let cultureId = formData.get('culture')

    if (formData.get('cultureName')) {
      const res: Culture = await fetch('/api/culture', {
        method: 'POST',
        body: JSON.stringify({ name: formData.get('cultureName') }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())

      cultureId = res.id
    }

    const res = await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        phone: formData.get('phoneNumber'),
        cultureId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log(await res.json())

    if (res.status === 200) {
      alert('Profile created!')

      window.location.reload()
    } else {
      alert('Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8 p-4 xs:p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
        <div className="space-x-4 space-y-4">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="number"
            name="phoneNumber"
            id="phoneNumber"
            className="border-2 text-slate-12  border-blackA-1 rounded-sm p-2"></input>
        </div>
        <div className="space-x-4 space-y-4">
          <label htmlFor="culture">Culture</label>
          <select
            name="culture"
            id="culture"
            className="border-2 min-w-[30ch] text-slate-12 border-blackA-1 rounded-sm p-2">
            {cultures.data?.map((culture: Culture) => (
              <option key={culture.id} value={culture.id}>
                {culture.name}
              </option>
            ))}
          </select>
          <label htmlFor="cultureName">or submit a new culture</label>
          <input
            type="text"
            name="cultureName"
            id="cultureName"
            className="border-2 border-blackA-1 text-slate-12 rounded-sm p-2"></input>
        </div>
        <div className="space-y-4">
          <button
            type="submit"
            className="bg-indigo-9 hover:bg-blackA-1 hover:border-indigo-9 transition-colors border-2 border-blackA-1 py-1 px-3 rounded-sm">
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}
