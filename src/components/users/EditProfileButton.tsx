import { Component, createSignal, createEffect } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { currentSession } from '../../lib/userSessionStore'
import { useStore } from '@nanostores/solid'
import type { AuthSession } from '@supabase/supabase-js'
import { SITE }  from '../../config'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const EditProfileButton: Component = () => {
    const [profileType, setProfileType] = createSignal<"Client"|"Provider"|null>(null)
    const [user, setUser] = createSignal<AuthSession | null>(null)


    //rewrite to check if we are on the client or provider profile page and redirect accordingly
    const editRedirect = async (e: SubmitEvent) => {
        e.preventDefault()

        try {
            setUser(useStore(currentSession)())
            console.log("window.location.href: " + window.location.href)
            console.log(SITE.devUrl + `/${lang}/client/profile`)
            if (window.location.href === SITE.devUrl + `/${lang}/provider/profile`) {
                location.href = `/${lang}/provider/editaccount`
            } else if (window.location.href === SITE.devUrl + `/${lang}/client/profile`) {
                location.href = `/${lang}/client/profile`
            } else {
                console.log(window.location.href)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={editRedirect}>
                <button class="btn-primary" type="submit">{t('buttons.editProfile')}</button>
            </form>
        </div>
    )
}