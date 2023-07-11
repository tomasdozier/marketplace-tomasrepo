import { Component, Suspense, createEffect, createResource, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import type { AuthSession } from '@supabase/supabase-js'

async function postFormData(formData: FormData) {
    const response = await fetch("/api/providerProfileSubmit", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    return data;
}

export const ProviderRegistration: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null)
    const [formData, setFormData] = createSignal<FormData>()
    const [response] = createResource(formData, postFormData)

    createEffect(async () => {
        const { data, error } = await supabase.auth.getSession()
        setSession(data.session)
        console.log(session())

        if (session()) {
            //Country
            try {
                const { data: countries, error } = await supabase.from('country').select('*');
                if (error) {
                    console.log("supabase error: " + error.message)
                } else {
                    console.log(countries)

                    countries.forEach(country => {
                        let countryOption = new Option(country.country, country.id)
                        document.getElementById("country")?.append((countryOption))
                    })
                }
            }
            catch (error) {
                console.log("Other error: " + error)
            }

            //Major Municipality
            try {
                const { data: majorMunicipality, error: errorMajorMunicipality } = await supabase.from('major_municipality').select('*');
                if (errorMajorMunicipality) {
                    console.log("supabase error: " + errorMajorMunicipality.message)
                } else {
                    console.log(majorMunicipality)

                    // majorMunicipality.forEach(municipality => {
                    //     let municipalityOption = new Option(municipality.major_municipality, municipality.id)
                    //     document.getElementById("MajorMunicipality")?.append((municipalityOption))
                    // })

                    document.getElementById("country")?.addEventListener('change', () => {
                        let municipalitySelect = document.getElementById("MajorMunicipality") as HTMLSelectElement

                        console.log(municipalitySelect)
                        let length = municipalitySelect?.length

                        for (let i = length - 1; i > -1; i--) {
                            console.log(i)
                            if (municipalitySelect.options[i].value !== "-1") {
                                municipalitySelect.remove(i)
                            }
                        }
                        let filteredMunicipality = majorMunicipality.filter(municipality => municipality.country == (document.getElementById("country") as HTMLSelectElement)?.value)
                        filteredMunicipality.forEach(municipality => {
                            let municipalityOption = new Option(municipality.major_municipality, municipality.id)
                            document.getElementById("MajorMunicipality")?.append((municipalityOption))
                        })
                    })

                }
            } catch (error) {
                console.log("Other error: " + error)
            }

            //Minor Municipality
            try {
                const { data: minorMunicipality, error: errorMinorMunicipality } = await supabase.from('minor_municipality').select('*');
                if (errorMinorMunicipality) {
                    console.log("supabase error: " + errorMinorMunicipality.message)
                } else {
                    console.log(minorMunicipality)

                    document.getElementById("MajorMunicipality")?.addEventListener('change', () => {
                        let municipalitySelect = document.getElementById("MinorMunicipality") as HTMLSelectElement

                        console.log(municipalitySelect)
                        let length = municipalitySelect?.length

                        for (let i = length - 1; i > -1; i--) {
                            console.log(i)
                            if (municipalitySelect.options[i].value !== "-1") {
                                municipalitySelect.remove(i)
                            }
                        }

                        let filteredMunicipality = minorMunicipality.filter(municipality => municipality.major_municipality == (document.getElementById("MajorMunicipality") as HTMLSelectElement)?.value)
                        filteredMunicipality.forEach(municipality => {
                            let municipalityOption = new Option(municipality.minor_municipality, municipality.id)
                            document.getElementById("MinorMunicipality")?.append((municipalityOption))
                        })
                    })
                }
            } catch (error) {
                console.log("Other error: " + error)
            }

            //Governing District
            try {
                const { data: governingDistrict, error: errorGoverningDistrict } = await supabase.from('governing_district').select('*');
                if (errorGoverningDistrict) {
                    console.log("supabase error: " + errorGoverningDistrict.message)
                } else {
                    console.log(governingDistrict)

                    document.getElementById("MinorMunicipality")?.addEventListener('change', () => {
                        let districtSelect = document.getElementById("GoverningDistrict") as HTMLSelectElement

                        console.log(districtSelect)
                        let length = districtSelect?.length

                        for (let i = length - 1; i > -1; i--) {
                            console.log(i)
                            if (districtSelect.options[i].value !== "-1") {
                                districtSelect.remove(i)
                            }
                        }

                        let filteredDistrict = governingDistrict.filter(district => district.minor_municipality == (document.getElementById("MinorMunicipality") as HTMLSelectElement)?.value)
                        filteredDistrict.forEach(district => {
                            let districtOption = new Option(district.governing_district, district.id)
                            document.getElementById("GoverningDistrict")?.append((districtOption))
                        })
                    })
                }
            } catch (error) {
                console.log("Other error: " + error)
            }

        } else {
            console.log("No session")
        }
    })

    function submit(e: SubmitEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement)
        formData.append("access_token",session()?.access_token!)
        formData.append("refresh_token",session()?.refresh_token!)
        setFormData(formData)
    }


    return (
        <div>
            <form onSubmit={submit}>
                <label for="FirstName">First Name:
                    <input type="text" id="FirstName" name="FirstName" required />
                </label>

                <label for="LastName">Last Name:
                    <input type="text" id="LastName" name="LastName" required />
                </label>


                <label for="ProviderName">Provider Name:
                    <input type="text" id="ProviderName" name="ProviderName" />
                </label>

                <label for="Phone">Phone Number:
                    <input type="text" id="Phone" name="Phone" required />
                </label>

                <label for="country">Country:
                    <select id="country" name="country" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                <label for="MajorMunicipality">Major Municipality:
                    <select id="MajorMunicipality" name="MajorMunicipality" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                <label for="MinorMunicipality">Minor Municipality:
                    <select id="MinorMunicipality" name="MinorMunicipality" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                <label for="GoverningDistrict">Governing District:
                    <select id="GoverningDistrict" name="GoverningDistrict" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                <button>Register</button>
                <Suspense>{response() && <p>{response().message}</p>}</Suspense>
            </form>
        </div>
    );
}

