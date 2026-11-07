import React, { useEffect, useRef, useState } from "react";
import { AssignmentTurnedInOutlined, HowToRegOutlined } from "@mui/icons-material";
import { Alert, Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {
  createDemoRequest, DEMO_STATUS_LABELS, listDemoRequests,
} from "./enrollmentDemoApi";

/** Fictional single-student request action; never creates an enrollment. */
export default function DemoRequestAction({ courseId }) {
  const [state, setState] = useState({ loading: true, submitting: false, record: null, error: "" });
  const [reload, setReload] = useState(0);
  const mutationController = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, submitting: false, record: null, error: "" });
    listDemoRequests({ signal: controller.signal })
      .then((records) => {
        if (!controller.signal.aborted) {
          setState({
            loading: false, submitting: false,
            record: records.find((record) => record.course_id === courseId) || null,
            error: "",
          });
        }
      })
      .catch((error) => {
        if (error?.name !== "AbortError" && !controller.signal.aborted) {
          setState({
            loading: false, submitting: false, record: null, error: error.message,
          });
        }
      });
    return () => {
      controller.abort();
      mutationController.current?.abort();
      mutationController.current = null;
    };
  }, [courseId, reload]);

  async function submit() {
    if (state.submitting || state.record || mutationController.current) return;
    const controller = new AbortController();
    mutationController.current = controller;
    setState((previous) => ({ ...previous, submitting: true, error: "" }));
    try {
      const record = await createDemoRequest(courseId, { signal: controller.signal });
      if (!controller.signal.aborted) {
        setState({ loading: false, submitting: false, record, error: "" });
      }
    } catch (error) {
      if (!controller.signal.aborted && error?.name !== "AbortError") {
        setState((previous) => ({
          ...previous, submitting: false,
          error: error instanceof Error ? error.message : "ثبت آزمایشی درخواست ناموفق بود.",
        }));
      }
    } finally {
      if (mutationController.current === controller) mutationController.current = null;
    }
  }

  return (
    <Box sx={{
      bgcolor: "#f7f6ff", border: "1px solid #e6e1fb", borderRadius: 3,
      p: { xs: 2, sm: 2.5 },
    }}>
      <Stack spacing={1.5}>
        <Stack direction="row" gap={1} alignItems="center">
          <HowToRegOutlined sx={{ color: "#5544a9" }} />
          <Typography fontWeight={850} color="#36306c">
            درخواست ثبت‌نام آزمایشی
          </Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ lineHeight: 2, fontSize: ".84rem" }}>
          این درخواست فقط برای نمایش فرایند ثبت‌نام با داده ساختگی است؛
          هیچ حساب واقعی، پرداخت یا دسترسی به دوره ایجاد نمی‌شود.
        </Typography>
        {state.error && (
          <Alert severity="error" action={(
            <Button color="inherit" size="small" disabled={state.submitting}
              onClick={() => setReload((value) => value + 1)}>
              تلاش مجدد
            </Button>
          )}>{state.error}</Alert>
        )}
        {state.record && (
          <Chip
            icon={<AssignmentTurnedInOutlined />}
            label={"وضعیت درخواست: " + DEMO_STATUS_LABELS[state.record.status]}
            color={state.record.status === "pending" ? "warning" : "default"}
            sx={{ alignSelf: "flex-start", fontWeight: 700 }}
          />
        )}
        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} alignItems="stretch">
          <Button
            variant="contained"
            onClick={submit}
            disabled={state.loading || state.submitting || Boolean(state.record)}
            sx={{
              bgcolor: "#5144ba", fontWeight: 800, borderRadius: 2.3,
              boxShadow: "none", px: 3,
              "&:hover": { bgcolor: "#40349e" },
            }}
          >
            {state.submitting ? "در حال ثبت…" : state.loading ? "در حال بررسی…" :
              state.record ? "درخواست قبلاً ثبت شده" : "ثبت درخواست آزمایشی"}
          </Button>
          <Button component={Link} to="/__preview/requests"
            variant="outlined" sx={{ borderRadius: 2.3, fontWeight: 750 }}>
            مشاهده درخواست‌های من
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
