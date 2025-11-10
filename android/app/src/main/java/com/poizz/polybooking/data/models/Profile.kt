package com.poizz.polybooking.data.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Profile(
    val id: String,
    @SerialName("username")
    val username: String,
    @SerialName("email")
    val email: String,
    @SerialName("avatar_url")
    val avatar_url: String,
    @SerialName("phone")
    val phone: String? = null,

    )
