# Copyright #TEMPLATE_COPYRIGHT_YEAR# Defense Unicorns
# SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

uds {
  bundle_api_version = "uds.dev/v1alpha1"
}

metadata {
  name        = "#TEMPLATE_APPLICATION_NAME#-test"
  description = "A UDS bundle for deploying #TEMPLATE_APPLICATION_DISPLAY_NAME# and its dependencies on a development cluster"
  version     = "dev"
}

package "#TEMPLATE_APPLICATION_NAME#" {
  source = "../zarf-package-#TEMPLATE_APPLICATION_NAME#-${sys.arch}-dev.tar.zst"

  # The test bundle consumes an unsigned package built from this checkout.
  signature_verification {
    verify = false
  }
}
